import React, { useState, useEffect } from 'react';
import { X, Hash, Bell, CheckCircle2, AlertCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { getSlackConfig, saveSlackConfig, testSlackConnection } from '../utils/slack';

export default function SlackModal({ onClose }) {
  const [config, setConfig] = useState(getSlackConfig());
  const [testStatus, setTestStatus] = useState(null); // { loading, success, error }
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSlackConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleTest = async () => {
    if (!config.webhookUrl) {
      setTestStatus({ loading: false, success: false, error: 'Please enter a Slack Webhook URL first.' });
      return;
    }
    setTestStatus({ loading: true, success: false, error: null });
    const res = await testSlackConnection(config.webhookUrl);
    if (res.success) {
      setTestStatus({ loading: false, success: true, error: null });
    } else {
      setTestStatus({ loading: false, success: false, error: res.error || 'Failed to send test message' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-neu-fade">
      <div className="w-full max-w-lg neu-raised overflow-hidden rounded-2xl border border-slate-300/60 shadow-2xl animate-neu-pop bg-[#E6ECEF]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-300/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl neu-raised flex items-center justify-center text-emerald-600">
              <Hash className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
                Slack Webhook Integration
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                  ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold">Push live card events & activity to Slack</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl neu-btn-secondary text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Master Enable Toggle */}
          <div className="p-4 rounded-xl neu-inset flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="text-xs font-bold text-slate-800">Enable Slack Notifications</div>
                <div className="text-[11px] text-slate-500">Send real-time updates when tasks change</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Webhook URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Slack Incoming Webhook URL
            </label>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXX"
              value={config.webhookUrl}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Create an incoming webhook in your Slack workspace settings to get this URL.
            </p>
          </div>

          {/* Channel Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Channel Name (Optional Display)
            </label>
            <input
              type="text"
              placeholder="#kanban-updates"
              value={config.channelName}
              onChange={(e) => setConfig({ ...config, channelName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-semibold"
            />
          </div>

          {/* Event Triggers Checklist */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Notification Event Triggers
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'cardCreated', label: '🆕 Card Created' },
                { key: 'cardMoved', label: '🔄 Card Moved' },
                { key: 'commentAdded', label: '💬 Comment Added' },
                { key: 'cardDeleted', label: '🗑️ Card Deleted' }
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    config.events[key]
                      ? 'neu-raised bg-indigo-50/50 text-indigo-700 border-indigo-200'
                      : 'neu-inset text-slate-500 border-transparent opacity-70'
                  }`}
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={config.events[key]}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        events: { ...config.events, [key]: e.target.checked }
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Connection Test Status */}
          {testStatus && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              testStatus.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {testStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{testStatus.success ? 'Test webhook sent to Slack successfully!' : testStatus.error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-300/40">
            <button
              type="button"
              onClick={handleTest}
              disabled={testStatus?.loading}
              className="px-4 py-2 rounded-xl neu-btn-secondary text-xs font-bold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-indigo-600" />
              <span>{testStatus?.loading ? 'Sending...' : 'Test Connection'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl neu-btn-secondary text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl neu-btn-primary text-xs font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{savedSuccess ? 'Saved!' : 'Save Integration'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
