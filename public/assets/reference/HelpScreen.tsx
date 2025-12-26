import React from 'react';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../../state/SettingsContext';
import { SettingsScreenWrapper } from '../../components/SettingsScreenWrapper';
import { SettingsActionItem } from '../../components/SettingsActionItem';
import { IconKey } from '../../components/Icon';

export const HelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings: _settings } = useSettings();

  const handleSupport = async () => {
    try {
      const url = 'https://thoughtmarks.app/support';
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open support link');
      }
    } catch (error) {
      console.error('[HelpScreen] Failed to open support:', error);
      Alert.alert('Error', 'Failed to open support link');
    }
  };

  const handleFAQ = async () => {
    try {
      const url = 'https://thoughtmarks.app/docs';
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open FAQ link');
      }
    } catch (error) {
      console.error('[HelpScreen] Failed to open FAQ:', error);
      Alert.alert('Error', 'Failed to open FAQ link');
    }
  };

  const handleContact = async () => {
    try {
      const url = 'mailto:support@thoughtmarks.app?subject=Thoughtmarks Support';
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open email client');
      }
    } catch (error) {
      console.error('[HelpScreen] Failed to open email:', error);
      Alert.alert('Error', 'Failed to open email client');
    }
  };

  const handleReportBug = async () => {
    try {
      const url = 'mailto:support@thoughtmarks.app?subject=Bug Report';
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open email client');
      }
    } catch (error) {
      console.error('[HelpScreen] Failed to open email:', error);
      Alert.alert('Error', 'Failed to open email client');
    }
  };

  return (
    <SettingsScreenWrapper
      title="Help & Support"
      onBackPress={() => navigation.goBack()}
    >
      <SettingsActionItem
        icon={'tm.settings.help' as IconKey}
        title="Contact Support"
        description="Get help from our support team"
        onPress={handleSupport}
        accessibilityLabel="Contact support team"
      />

      <SettingsActionItem
        icon={'tm.actions.info' as IconKey}
        title="Frequently Asked Questions"
        description="Find answers to common questions"
        onPress={handleFAQ}
        accessibilityLabel="View frequently asked questions"
      />

      <SettingsActionItem
        icon={'tm.settings.mail' as IconKey}
        title="Send Feedback"
        description="Share your thoughts and suggestions"
        onPress={handleContact}
        accessibilityLabel="Send feedback to the team"
      />

      <SettingsActionItem
        icon={'tm.status.warning' as IconKey}
        title="Report a Bug"
        description="Help us improve by reporting issues"
        onPress={handleReportBug}
        accessibilityLabel="Report a bug or issue"
      />
    </SettingsScreenWrapper>
  );
};