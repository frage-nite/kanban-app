// Slack Webhook Integration Utility for ForgeFlow Kanban

const SLACK_STORAGE_KEY = 'forgeflow_slack_config';

export function getSlackConfig() {
  try {
    const saved = localStorage.getItem(SLACK_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse Slack config:', e);
  }
  return {
    webhookUrl: '',
    channelName: '#kanban-updates',
    enabled: false,
    events: {
      cardCreated: true,
      cardMoved: true,
      commentAdded: true,
      cardDeleted: true
    }
  };
}

export function saveSlackConfig(config) {
  try {
    localStorage.setItem(SLACK_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Slack config:', e);
  }
}

/**
 * Send Slack Notification via Incoming Webhook
 */
export async function sendSlackNotification({ eventType, cardTitle, listTitle, sourceList, destList, commentText, author }) {
  const config = getSlackConfig();
  if (!config.enabled || !config.webhookUrl) return;

  // Check if event is enabled in user settings
  if (config.events && config.events[eventType] === false) return;

  let emoji = '📌';
  let titleText = '';
  let color = '#4F46E5';

  switch (eventType) {
    case 'cardCreated':
      emoji = '🆕';
      titleText = `*New Card Created:* ${cardTitle}`;
      color = '#10B981';
      break;
    case 'cardMoved':
      emoji = '🔄';
      titleText = `*Card Moved:* ${cardTitle}`;
      color = '#3B82F6';
      break;
    case 'commentAdded':
      emoji = '💬';
      titleText = `*New Comment on:* ${cardTitle}`;
      color = '#8B5CF6';
      break;
    case 'cardDeleted':
      emoji = '🗑️';
      titleText = `*Card Deleted:* ${cardTitle}`;
      color = '#EF4444';
      break;
    default:
      titleText = `*Kanban Update:* ${cardTitle}`;
  }

  const fields = [];
  if (sourceList && destList) {
    fields.push({
      type: 'mrkdwn',
      text: `*Movement:* ${sourceList} ➔ *${destList}*`
    });
  } else if (listTitle) {
    fields.push({
      type: 'mrkdwn',
      text: `*Column:* ${listTitle}`
    });
  }

  if (author) {
    fields.push({
      type: 'mrkdwn',
      text: `*By:* ${author}`
    });
  }

  if (commentText) {
    fields.push({
      type: 'mrkdwn',
      text: `*Comment:* _"${commentText}"_`
    });
  }

  const payload = {
    attachments: [
      {
        color: color,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${emoji} ${titleText}`
            }
          },
          ...(fields.length > 0
            ? [
                {
                  type: 'section',
                  fields: fields
                }
              ]
            : []),
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `⚡ *ForgeFlow Kanban* • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              }
            ]
          }
        ]
      }
    ]
  };

  try {
    await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors' // Slack incoming webhooks support standard CORS / no-cors mode
    });
    return { success: true };
  } catch (err) {
    console.error('Slack Webhook Error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send Test Webhook Message
 */
export async function testSlackConnection(webhookUrl) {
  if (!webhookUrl) return { success: false, error: 'Webhook URL is required' };

  const testPayload = {
    attachments: [
      {
        color: '#4F46E5',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '🎉 *Slack Integration Connected!* ForgeFlow Kanban is now linked to this channel.'
            }
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `⚡ Test sent at ${new Date().toLocaleTimeString()}`
              }
            ]
          }
        ]
      }
    ]
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
      mode: 'no-cors'
    });
    return { success: true };
  } catch (err) {
    console.error('Slack Test Connection Failed:', err);
    return { success: false, error: err.message };
  }
}
