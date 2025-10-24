import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Linking, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getScrollBottomInset } from '../../design-system/recipes/nav';
import { getSpacing } from '../../design-system/utils/semanticAccessors';
import { useSemantics } from '../../design-system/runtime/ThemeProvider';
import { Typography } from '../../design-system/recipes/typography';
import LayoutWrapper from '../../components/LayoutWrapper';
import { useTranslation } from '../../i18n/I18nProvider';
import { versionPinningService, type VersionInfo } from '../../services/safety/VersionPinningService';
import { IconKey } from '../../components/Icon';

// Design System Components
import {
  SettingsScreenHeader,
  SettingsSectionHeader,
  SettingsListItem,
} from '../../design-system/components/settings';

export const SettingsAboutScreen: React.FC = () => {
  const navigation = useNavigation();
  const sem = useSemantics('settings');
  const { t } = useTranslation();
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(() => (
    versionPinningService.isInitialized() ? versionPinningService.getCurrentVersion() : null
  ));
  const accentPrimary = useMemo(
    () => sem.colors?.accent?.primary ?? sem.accent?.primary ?? '#007AFF',
    [sem]
  );
  const surfaceBackground = useMemo(
    () => sem.colors?.background?.secondary ?? sem.background.surface,
    [sem]
  );

  useEffect(() => {
    let isMounted = true;

    const loadVersionInfo = async () => {
      try {
        if (!versionPinningService.isInitialized()) {
          await versionPinningService.initialize();
        }

        const info = versionPinningService.getCurrentVersion();
        if (isMounted) {
          setVersionInfo(info);
        }
      } catch (error) {
        console.error('[SettingsAboutScreen] Failed to load version info:', error);
        if (isMounted) {
          setVersionInfo(null);
        }
      }
    };

    loadVersionInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const supportUrl = 'https://thoughtmarks.app/support';
  const feedbackMailTo = 'mailto:support@thoughtmarks.app?subject=Thoughtmarks%20Feedback';

  const handleHelpSupport = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(supportUrl);
      if (canOpen) {
        await Linking.openURL(supportUrl);
        return;
      }

      Alert.alert(t('common.error'), t('settings.about.openSupportLinkError'));
    } catch (error) {
      console.error('[SettingsAboutScreen] Failed to open help link:', error);
      Alert.alert(t('common.error'), t('settings.about.openSupportLinkFailure'));
    }
  }, [t]);

  const handleSendFeedback = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(feedbackMailTo);
      if (canOpen) {
        await Linking.openURL(feedbackMailTo);
        return;
      }

      Alert.alert(t('common.error'), t('settings.about.openFeedbackClientError'));
    } catch (error) {
      console.error('[SettingsAboutScreen] Failed to open feedback mail client:', error);
      Alert.alert(t('common.error'), t('settings.about.openFeedbackClientFailure'));
    }
  }, [t]);

  const versionLabel = useMemo(() => {
    if (!versionInfo) {
      return t('settings.about.versionUnavailable');
    }

    if (Platform.OS === 'ios') {
      return t('settings.about.versionWithBuild', {
        version: versionInfo.version,
        build: versionInfo.buildNumber ?? t('settings.about.versionUnknown'),
      });
    }

    if (Platform.OS === 'android') {
      return t('settings.about.versionWithCode', {
        version: versionInfo.version,
        code: versionInfo.versionCode ?? t('settings.about.versionUnknown'),
      });
    }

    return t('settings.about.versionOnly', { version: versionInfo.version });
  }, [t, versionInfo]);

  const copyrightNotice = useMemo(
    () => t('settings.about.copyright', { year: new Date().getFullYear() }),
    [t]
  );

  return (
    <LayoutWrapper context="settings" edgeToEdge>
      <View style={{ flex: 1, backgroundColor: sem.background.primary }}>
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ 
            padding: getSpacing(sem, 'xs'),
            paddingBottom: getScrollBottomInset('settings'),
          }}
        >
          <SettingsScreenHeader
            title={t('settings.about.title')}
            subtitle={t('settings.about.subtitle')}
            onBackPress={() => navigation.goBack()}
          />

          <View style={{ marginTop: getSpacing(sem, 'md') }}>
            <SettingsSectionHeader title={t('settings.about.infoSectionTitle')} />
            
            <View style={{ 
              backgroundColor: surfaceBackground,
              borderRadius: sem.radius?.lg || 12,
              padding: getSpacing(sem, 'lg'),
              marginTop: getSpacing(sem, 'sm')
            }}>
              <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: getSpacing(sem, 'md')
              }}>
                {/* App Icon Placeholder */}
                <View style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12,
                  backgroundColor: `${accentPrimary}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: getSpacing(sem, 'sm')
                }}>
                  <Typography variant="h1" style={{ 
                    color: accentPrimary,
                    fontSize: 24
                  }}>
                    TM
                  </Typography>
                </View>
                <Typography variant="h3" style={{ 
                  color: sem.colors.text.primary
                }}>
                  Thoughtmarks
                </Typography>
              </View>
              
              <Typography
                variant="body"
                style={{ 
                  color: sem.colors.text.secondary,
                  marginBottom: getSpacing(sem, 'sm')
                }}
              >
                {versionLabel}
              </Typography>
              
              <Typography variant="body" style={{ 
                color: sem.colors.text.secondary,
                marginBottom: getSpacing(sem, 'md')
              }}>
                {t('settings.about.tagline')}
              </Typography>
              
              <Typography variant="caption" style={{ 
                color: sem.colors.text.tertiary
              }}>
                {copyrightNotice}
              </Typography>
            </View>
          </View>

          <View style={{ marginTop: getSpacing(sem, 'lg') }}>
            <SettingsSectionHeader title={t('settings.about.supportSectionTitle')} />
            
            <SettingsListItem
              icon={'tm.settings.help' as IconKey}
              title={t('settings.about.helpTitle')}
              subtitle={t('settings.about.helpSubtitle')}
              onPress={handleHelpSupport}
            />
            
            <SettingsListItem
              icon={'tm.settings.mail' as IconKey}
              title={t('settings.about.feedbackTitle')}
              subtitle={t('settings.about.feedbackSubtitle')}
              onPress={handleSendFeedback}
            />
          </View>
        </ScrollView>
      </View>
    </LayoutWrapper>
  );
};
