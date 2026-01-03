import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const steps = [
  { id: 1, title: 'Dependencies', description: 'Install required tools' },
  { id: 2, title: 'API Credentials', description: 'Get Telegram API keys' },
  { id: 3, title: 'Configuration', description: 'Configure scripts' },
  { id: 4, title: 'Authentication', description: 'First login' },
  { id: 5, title: 'Calibration', description: 'Set up call button' },
  { id: 6, title: 'Testing', description: 'Test functionality' },
  { id: 7, title: 'Siri Integration', description: 'Set up shortcuts' },
  { id: 8, title: 'Complete', description: 'All done!' }
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [username, setUsername] = useState('');
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [phone, setPhone] = useState('');
  const [checks, setChecks] = useState({});

  useEffect(() => {
    // Load saved progress
    const savedProgress = localStorage.getItem('telegram-siri-progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      setCurrentStep(data.currentStep || 1);
      setCompletedSteps(data.completedSteps || []);
      setApiId(data.apiId || '');
      setApiHash(data.apiHash || '');
      setPhone(data.phone || '');
    }

    // Get username
    if (window.electron) {
      window.electron.getUsername().then(name => setUsername(name));
    }
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem('telegram-siri-progress', JSON.stringify({
      currentStep,
      completedSteps,
      apiId,
      apiHash,
      phone
    }));
  }, [currentStep, completedSteps, apiId, apiHash, phone]);

  const markStepComplete = (step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const nextStep = () => {
    markStepComplete(currentStep);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="app">
      <div className="app-background"></div>

      <div className="app-container">
        {/* Header */}
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo-section">
            <div className="logo">📱</div>
            <div>
              <h1>Telegram Siri Setup</h1>
              <p>Control Telegram with your voice on macOS</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="progress-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`progress-step ${currentStep === step.id ? 'active' : ''} ${completedSteps.includes(step.id) ? 'completed' : ''}`}
                onClick={() => goToStep(step.id)}
              >
                <div className="step-circle">
                  {completedSteps.includes(step.id) ? '✓' : step.id}
                </div>
                <div className="step-label">{step.title}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="step-content"
            >
              <StepContent
                step={currentStep}
                checks={checks}
                setChecks={setChecks}
                username={username}
                apiId={apiId}
                setApiId={setApiId}
                apiHash={apiHash}
                setApiHash={setApiHash}
                phone={phone}
                setPhone={setPhone}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          className="navigation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <div className="step-indicator">
            Step {currentStep} of {steps.length}
          </div>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="btn btn-primary"
          >
            {currentStep === steps.length ? 'Finish' : 'Next'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function StepContent({ step, checks, setChecks, username, apiId, setApiId, apiHash, setApiHash, phone, setPhone }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = async (text, index) => {
    if (window.electron) {
      await window.electron.copyToClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const checkInstallation = async (type) => {
    if (!window.electron) return;

    let result;
    switch(type) {
      case 'homebrew':
        result = await window.electron.checkHomebrew();
        break;
      case 'cliclick':
        result = await window.electron.checkCliclick();
        break;
      case 'python':
        result = await window.electron.checkPython();
        break;
      case 'venv':
        result = await window.electron.checkVenv();
        break;
      default:
        return;
    }

    setChecks({ ...checks, [type]: result });
  };

  const openUrl = async (url) => {
    if (window.electron) {
      await window.electron.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const CommandBox = ({ command, description, index }) => (
    <div className="command-box">
      <div className="command-header">
        <span className="command-description">{description}</span>
      </div>
      <div className="command-content">
        <code>{command}</code>
        <button
          className="copy-btn"
          onClick={() => copyToClipboard(command, index)}
        >
          {copiedIndex === index ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );

  const InfoBox = ({ children, type = 'info' }) => (
    <div className={`info-box info-${type}`}>
      {children}
    </div>
  );

  const CheckItem = ({ type, label, onCheck }) => {
    const check = checks[type];
    return (
      <div className="check-item">
        <div className="check-content">
          <span>{label}</span>
          {check && (
            <span className={check.installed || check.exists ? 'status-success' : 'status-error'}>
              {check.installed || check.exists ? '✓ Installed' : '✗ Not found'}
            </span>
          )}
        </div>
        <button className="btn btn-small" onClick={onCheck}>
          Check
        </button>
      </div>
    );
  };

  switch(step) {
    case 1:
      return (
        <div className="step-inner">
          <h2>📦 Install Dependencies</h2>
          <p>Let's install the required tools for Telegram Siri integration.</p>

          <InfoBox type="warning">
            <strong>⚠️ Important:</strong> Clone the repository to your home directory to avoid macOS permission issues with nested folders.
          </InfoBox>

          <div className="step-section">
            <h3>1. Install Homebrew (if needed)</h3>
            <CommandBox
              command='/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
              description="Install Homebrew package manager"
              index={0}
            />
            <CheckItem
              type="homebrew"
              label="Homebrew"
              onCheck={() => checkInstallation('homebrew')}
            />
          </div>

          <div className="step-section">
            <h3>2. Install cliclick</h3>
            <CommandBox
              command="brew install cliclick"
              description="Install cliclick for automated clicking"
              index={1}
            />
            <CheckItem
              type="cliclick"
              label="cliclick"
              onCheck={() => checkInstallation('cliclick')}
            />
          </div>

          <div className="step-section">
            <h3>3. Clone Repository</h3>
            <CommandBox
              command="cd ~ && git clone https://github.com/shaxa484/telegram-siri.git"
              description="Clone to home directory"
              index={2}
            />
          </div>

          <div className="step-section">
            <h3>4. Set up Python Environment</h3>
            <CommandBox
              command="cd ~/telegram-siri && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
              description="Create virtual environment and install dependencies"
              index={3}
            />
            <CheckItem
              type="python"
              label="Python 3"
              onCheck={() => checkInstallation('python')}
            />
            <CheckItem
              type="venv"
              label="Virtual Environment"
              onCheck={() => checkInstallation('venv')}
            />
          </div>
        </div>
      );

    case 2:
      return (
        <div className="step-inner">
          <h2>🔑 Get Telegram API Credentials</h2>
          <p>You'll need API credentials from Telegram to use this app.</p>

          <div className="step-section">
            <h3>Steps to get your API credentials:</h3>
            <ol className="steps-list">
              <li>
                Visit{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); openUrl('https://my.telegram.org'); }}>
                  https://my.telegram.org
                </a>
              </li>
              <li>Log in with your phone number</li>
              <li>Click on "API development tools"</li>
              <li>Create a new application (you can use any name)</li>
              <li>Copy your <code>api_id</code> and <code>api_hash</code></li>
            </ol>
          </div>

          <InfoBox>
            <strong>💡 Tip:</strong> Your API credentials are free and tied to your Telegram account. Keep them private!
          </InfoBox>

          <div className="step-section">
            <h3>Enter your credentials:</h3>
            <div className="form-group">
              <label>API ID</label>
              <input
                type="text"
                placeholder="12345678"
                value={apiId}
                onChange={(e) => setApiId(e.target.value)}
                className="input"
              />
            </div>
            <div className="form-group">
              <label>API Hash</label>
              <input
                type="text"
                placeholder="abcdef1234567890"
                value={apiHash}
                onChange={(e) => setApiHash(e.target.value)}
                className="input"
              />
            </div>
            <div className="form-group">
              <label>Phone Number (international format)</label>
              <input
                type="text"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="step-inner">
          <h2>⚙️ Configure Scripts</h2>
          <p>Let's configure the scripts with your API credentials and contacts.</p>

          <div className="step-section">
            <h3>1. Edit send_telegram.py</h3>
            <InfoBox>
              Open <code>~/telegram-siri/send_telegram.py</code> and update lines 13-15:
            </InfoBox>
            <div className="command-box">
              <div className="command-content">
                <code>
                  {`api_id = ${apiId || 'YOUR_API_ID'}  # Your API ID\napi_hash = '${apiHash || 'YOUR_API_HASH'}'  # Your API hash\nphone = '${phone || '+1234567890'}'  # Your phone number`}
                </code>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(`api_id = ${apiId || 'YOUR_API_ID'}\napi_hash = '${apiHash || 'YOUR_API_HASH'}'\nphone = '${phone || '+1234567890'}'`, 10)}
                >
                  {copiedIndex === 10 ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="step-section">
            <h3>2. Add Your Contacts</h3>
            <InfoBox>
              Add your contacts in <code>send_telegram.py</code> (around line 20):
            </InfoBox>
            <div className="command-box">
              <div className="command-content">
                <code>
{`CONTACTS = {
    'john': 'john_username',  # No @ symbol
    'mom': '+1987654321',     # Can use phone numbers
    # Add more contacts here
}`}
                </code>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard("CONTACTS = {\n    'john': 'john_username',\n    'mom': '+1987654321',\n}", 11)}
                >
                  {copiedIndex === 11 ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="step-section">
            <h3>3. Add Same Contacts in telegram_call.sh</h3>
            <InfoBox>
              Update the <code>get_username()</code> function in <code>telegram_call.sh</code>:
            </InfoBox>
            <div className="command-box">
              <div className="command-content">
                <code>
{`get_username() {
    case "$1" in
        "john")
            echo "john_username"
            ;;
        "mom")
            echo "+1987654321"
            ;;
        *)
            echo ""
            ;;
    esac
}`}
                </code>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard('get_username() {\n    case "$1" in\n        "john")\n            echo "john_username"\n            ;;\n        "mom")\n            echo "+1987654321"\n            ;;\n        *)\n            echo ""\n            ;;\n    esac\n}', 12)}
                >
                  {copiedIndex === 12 ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="step-inner">
          <h2>🔐 First Login</h2>
          <p>Let's log in to Telegram to create a session file.</p>

          <div className="step-section">
            <h3>Run the login command:</h3>
            <CommandBox
              command="cd ~/telegram-siri && source venv/bin/activate && python3 send_telegram.py john 'test message'"
              description="Login to Telegram (replace 'john' with your contact name)"
              index={20}
            />
          </div>

          <InfoBox type="warning">
            <strong>What will happen:</strong>
            <ol className="steps-list">
              <li>Telegram will send a code to your Telegram app</li>
              <li>Enter the code when prompted in Terminal</li>
              <li>If you have 2FA enabled, enter your password</li>
              <li>A <code>telegram_session.session</code> file will be created</li>
            </ol>
          </InfoBox>

          <InfoBox>
            <strong>💡 Important:</strong> The session file keeps you logged in. Don't delete it or share it with anyone!
          </InfoBox>
        </div>
      );

    case 5:
      return (
        <div className="step-inner">
          <h2>🎯 Calibrate Call Button</h2>
          <p>For voice calls to work, we need to find the exact position of Telegram's call button.</p>

          <InfoBox type="warning">
            <strong>⚠️ IMPORTANT:</strong> Telegram MUST be in windowed mode, NOT fullscreen!
          </InfoBox>

          <div className="step-section">
            <h3>Why two-step calibration?</h3>
            <p>When Siri activates, it can overlap UI elements in the chat header. By opening the contact's profile first, the call button appears in a position that won't be blocked by Siri.</p>
          </div>

          <div className="step-section">
            <h3>Calibration steps:</h3>
            <ol className="steps-list">
              <li>Open Telegram Desktop in windowed mode</li>
              <li>Resize it to your preferred window size</li>
              <li>Open any chat</li>
              <li>Run the calibration script:</li>
            </ol>

            <CommandBox
              command="cd ~/telegram-siri && ./find_coordinates.sh"
              description="Run calibration script"
              index={30}
            />

            <ol className="steps-list" start={5}>
              <li><strong>Step 1:</strong> Hover over the contact name in the header → Press Enter</li>
              <li><strong>Step 2:</strong> Click the header to open profile, then hover over the call button in the profile → Press Enter</li>
              <li>Coordinates will be saved to <code>coordinates.txt</code></li>
            </ol>
          </div>

          <InfoBox>
            <strong>💡 Note:</strong> If you resize or move the Telegram window later, you'll need to recalibrate!
          </InfoBox>
        </div>
      );

    case 6:
      return (
        <div className="step-inner">
          <h2>🧪 Test Commands</h2>
          <p>Let's test that everything is working correctly!</p>

          <div className="step-section">
            <h3>1. Test Sending a Message</h3>
            <CommandBox
              command='./telegram_sender.sh "john hello there"'
              description="Send a test message (replace 'john' with your contact)"
              index={40}
            />
          </div>

          <div className="step-section">
            <h3>2. Test Making a Call</h3>
            <InfoBox type="warning">
              Make sure Telegram is open in windowed mode before testing!
            </InfoBox>
            <CommandBox
              command='./telegram_call.sh "call john"'
              description="Make a test call (replace 'john' with your contact)"
              index={41}
            />
          </div>

          <InfoBox>
            <strong>✅ Success indicators:</strong>
            <ul className="steps-list">
              <li>Message should appear in the Telegram chat</li>
              <li>Call should automatically initiate in Telegram</li>
              <li>No permission errors in Terminal</li>
            </ul>
          </InfoBox>

          <InfoBox type="warning">
            <strong>🔧 If something doesn't work:</strong>
            <ul className="steps-list">
              <li>Check that you're in the telegram-siri directory</li>
              <li>Make sure virtual environment is activated</li>
              <li>Verify contact names match exactly</li>
              <li>For calls: ensure Telegram is in windowed mode and recalibrate if needed</li>
            </ul>
          </InfoBox>
        </div>
      );

    case 7:
      return (
        <div className="step-inner">
          <h2>🎤 Siri Integration</h2>
          <p>The final step - let's set up Siri shortcuts!</p>

          <div className="step-section">
            <h3>Shortcut 1: Send Telegram Message</h3>
            <ol className="steps-list">
              <li>Open the <strong>Shortcuts</strong> app on your Mac</li>
              <li>Click the <strong>+</strong> button to create a new shortcut</li>
              <li>Add a <strong>Text</strong> action and set it to <code>Shortcut Input</code></li>
              <li>Add a <strong>Run Shell Script</strong> action with these settings:</li>
            </ol>

            <div className="form-group">
              <label>Shell:</label>
              <input type="text" value="/bin/bash" disabled className="input" />
            </div>
            <div className="form-group">
              <label>Pass Input:</label>
              <input type="text" value="as arguments" disabled className="input" />
            </div>
            <div className="form-group">
              <label>Script:</label>
              <div className="command-box">
                <div className="command-content">
                  <code>/Users/{username}/telegram-siri/telegram_sender.sh "$1"</code>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(`/Users/${username}/telegram-siri/telegram_sender.sh "$1"`, 50)}
                  >
                    {copiedIndex === 50 ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>
            </div>
            <ol className="steps-list" start={5}>
              <li>Name the shortcut "Send Telegram"</li>
            </ol>
          </div>

          <div className="step-section">
            <h3>Shortcut 2: Telegram Call</h3>
            <ol className="steps-list">
              <li>Create another new shortcut</li>
              <li>Add a <strong>Text</strong> action → <code>Shortcut Input</code></li>
              <li>Add a <strong>Run Shell Script</strong> action:</li>
            </ol>

            <div className="form-group">
              <label>Script:</label>
              <div className="command-box">
                <div className="command-content">
                  <code>/Users/{username}/telegram-siri/telegram_call.sh "call $1"</code>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(`/Users/${username}/telegram-siri/telegram_call.sh "call $1"`, 51)}
                  >
                    {copiedIndex === 51 ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>
            </div>
            <ol className="steps-list" start={4}>
              <li>Name it "Telegram Call"</li>
            </ol>
          </div>

          <div className="step-section">
            <h3>Grant Permissions</h3>
            <InfoBox type="warning">
              When you first run these shortcuts, macOS will ask for permissions:
            </InfoBox>
            <ol className="steps-list">
              <li>Go to <strong>System Settings → Privacy & Security → Accessibility</strong></li>
              <li>Add and enable: <strong>Terminal</strong> and <strong>Shortcuts</strong></li>
              <li>Allow <strong>Shortcuts</strong> to control <strong>Telegram</strong> when prompted</li>
            </ol>
          </div>
        </div>
      );

    case 8:
      return (
        <div className="step-inner">
          <h2>🎉 Setup Complete!</h2>
          <p>Congratulations! You're all set to control Telegram with Siri.</p>

          <div className="success-card">
            <div className="success-icon">✨</div>
            <h3>Ready to use!</h3>
          </div>

          <div className="step-section">
            <h3>Try these Siri commands:</h3>
            <div className="siri-commands">
              <div className="siri-command">
                <span className="siri-icon">🗣️</span>
                <div>
                  <strong>"Hey Siri, send telegram message, John what's up"</strong>
                  <p>Sends a message to John</p>
                </div>
              </div>
              <div className="siri-command">
                <span className="siri-icon">📞</span>
                <div>
                  <strong>"Hey Siri, telegram call, Mom"</strong>
                  <p>Calls Mom on Telegram</p>
                </div>
              </div>
            </div>
          </div>

          <InfoBox>
            <strong>📚 Quick Tips:</strong>
            <ul className="steps-list">
              <li>Keep Telegram in windowed mode for calls</li>
              <li>Don't delete the <code>telegram_session.session</code> file</li>
              <li>If you move Telegram window, recalibrate the call button</li>
              <li>Add more contacts anytime by editing the scripts</li>
            </ul>
          </InfoBox>

          <div className="step-section">
            <h3>Need Help?</h3>
            <p>
              Check the troubleshooting section in the README or contact support on Telegram:{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); openUrl('https://t.me/sh89769'); }}>
                @sh89769
              </a>
            </p>
          </div>

          <div className="reset-section">
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (confirm('Are you sure you want to reset the setup progress?')) {
                  localStorage.removeItem('telegram-siri-progress');
                  window.location.reload();
                }
              }}
            >
              Reset Setup
            </button>
          </div>
        </div>
      );

    default:
      return <div>Step not found</div>;
  }
}

export default App;
