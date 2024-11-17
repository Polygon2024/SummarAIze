interface UserSettings {
  translationOn: boolean;
  preferredLanguage: string;
}

const saveUserSettings = (settings: UserSettings): void => {
  chrome.storage.sync.set({ userSettings: settings }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving user settings:', chrome.runtime.lastError);
    } else {
      console.log('User settings saved successfully:', settings);
    }
  });
};

export const getUserSettings = async (): Promise<UserSettings> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['userSettings'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(
          result.userSettings || {
            translationOn: false,
            preferredLanguage: 'en',
          }
        );
      }
    });
  });
};

export const updateUserSettings = async (
  newSettings: Partial<UserSettings>
): Promise<void> => {
  const currentSettings = await getUserSettings();
  const updatedSettings: UserSettings = { ...currentSettings, ...newSettings };
  saveUserSettings(updatedSettings);
};
