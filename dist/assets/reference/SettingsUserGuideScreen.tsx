/**
 * Settings User Guide Screen
 * Consolidated user guide with deep-link targets for onboarding
 */

import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, ViewStyle, Text, TextStyle, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSemantics } from '../../design-system/runtime/ThemeProvider';
import { Typography } from '../../design-system/recipes/typography';
import { Icon } from '../../design-system/components';
import { IconKey } from '../../components/Icon';
import { getSpacing } from '../../design-system/utils/semanticAccessors';
import {
  SettingsListItem,
  SettingsSectionHeader,
  SettingsScreenHeader,
} from '../../design-system/components/settings';
import { getScrollBottomInset } from '../../design-system/recipes/nav';
import { appTelemetry } from '../../services/telemetry/appTelemetry';

interface GuideSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  content: string[];
  expanded: boolean;
  deepLinkTarget?: string; // For onboarding deep-links
}

interface RouteParams {
  section?: string; // Deep-link target section
  autoExpand?: boolean; // Auto-expand section from deep-link
}

// Helper to render text with bold formatting
const renderFormattedText = (text: string, sem: ReturnType<typeof useSemantics>, key: string) => {
  // Split text by **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return (
    <Text
      key={key}
      style={{
        color: sem.text.primary,
        fontSize: sem.typography?.body?.size || 16,
        lineHeight: 22,
      } as TextStyle}
    >
      {parts.map((part, index) => {
        // Check if this part is bold (wrapped in **)
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <Text
              key={index}
              style={{
                fontWeight: (sem.typography?.h3?.weight as '700') || '700',
                color: sem.text.primary,
              } as TextStyle}
            >
              {boldText}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
};

export const SettingsUserGuideScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const sem = useSemantics('settings');
  
  const routeParams = route.params as RouteParams || {};
  
  const [sections, setSections] = useState<GuideSection[]>([
    {
      id: 'getting-started',
      icon: 'tm.actions.info',
      title: 'Getting Started',
      description: 'Welcome to Thoughtmarks - your second brain',
      content: [
        '**What Are Thoughtmarks**\nThoughtmarks are your saved ideas — quick notes, quotes, or snippets of insight.\nEach one captures a single thought so you can connect them later into bigger patterns.',
        '**Quick Capture**\nTap the + button to create a new Thoughtmark instantly.\nOr say "Siri, add a Thoughtmark" on your Apple iPhone or with a paired Apple Watch for a hands-free note.',
        '**Types of Thoughtmarks**\nText, voice, or link — anything that sparks a thought. Voice-to-Thoughtmark notes transcribe automatically to make capture a breeze!',
        '**Organization**\nUse Bins to group Thoughtmarks by theme, project, or mood.\nSearch or filter by tags to surface what matters fast.',
      ],
      expanded: false,
      deepLinkTarget: 'getting-started',
    },
    {
      id: 'thoughtmarks',
      icon: 'tm.features.document',
      title: 'Thoughtmarks',
      description: 'Your personal library of insights',
      content: [
        '• Tap any Thoughtmark to edit or expand.\n• Long-press to pin, share, or move between bins.\n• Use filters (All, pinned, ideas, etc.) to focus on one category at a time.',
      ],
      expanded: false,
      deepLinkTarget: 'creating-thoughtmarks',
    },
    {
      id: 'bins',
      icon: 'tm.features.folder',
      title: 'Bins',
      description: 'Bins act like smart folders',
      content: [
        '• Create bins for "Projects," "Reading," or "Podcast Ideas."\n• Add Thoughtmarks by tag or drag-and-drop.\n• Tap ••• to rename, reorder, or delete a bin.',
      ],
      expanded: false,
      deepLinkTarget: 'organizing-bins',
    },
    {
      id: 'voice',
      icon: 'tm.features.voice',
      title: 'Voice',
      description: 'Record ideas anytime',
      content: [
        '• Tap the mic tab to start recording.\n• Watch app recordings sync automatically and convert to text.\n• Review, edit, or tag the transcription just like a normal Thoughtmark.',
      ],
      expanded: false,
      deepLinkTarget: 'voice-siri-integration',
    },
    {
      id: 'ai-tools',
      icon: 'tm.nav.ai',
      title: 'AI Tools',
      description: 'AI helps connect your dots',
      content: [
        '• Use Insights to reveal themes across your notes.\n• Tap Related to see how different Thoughtmarks link together.\n• Ask questions in natural language: "What were my ideas about creativity last week?"',
      ],
      expanded: false,
      deepLinkTarget: 'ai-powered-features',
    },
    {
      id: 'search',
      icon: 'tm.actions.search',
      title: 'Search',
      description: 'Search is global and fast',
      content: [
        '• Type keywords, phrases, or tags.\n• Use filters like text only or voice notes.\n• Recent searches appear automatically for quick recall.',
      ],
      expanded: false,
      deepLinkTarget: 'search-discovery',
    },
    {
      id: 'settings',
      icon: 'tm.actions.settings',
      title: 'Settings',
      description: 'Customize your workspace',
      content: [
        '• Choose light or dark mode, or follow system.\n• Manage account and premium plan.\n• Configure privacy, backup, and data export options.',
      ],
      expanded: false,
      deepLinkTarget: 'settings-customization',
    },
    {
      id: 'tips',
      icon: 'star',
      title: 'Tips',
      description: 'Power user features',
      content: [
        '• Try tagging your Thoughtmarks with verbs — read, watch, build — for better filtering.\n• Add a quick Thoughtmark from the widget or watch app to never lose an idea.\n• Review pinned notes at the start of your day.',
      ],
      expanded: false,
      deepLinkTarget: 'pro-tips-shortcuts',
    },
  ]);

  useEffect(() => {
    // Handle deep-link navigation
    if (routeParams.section) {
      const targetSection = sections.find(section => section.deepLinkTarget === routeParams.section);
      if (targetSection && routeParams.autoExpand) {
        toggleSection(targetSection.id);
        
        // Track deep-link access
        appTelemetry.track('engagement_user_guide_deeplink_accessed', {
          section: routeParams.section,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Track screen view
    appTelemetry.track('engagement_user_guide_screen_viewed', {
      timestamp: new Date().toISOString(),
    });
  }, [routeParams.section, routeParams.autoExpand]);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(section => 
      section.id === id 
        ? { ...section, expanded: !section.expanded }
        : section
    ));

    // Track section interaction
    const section = sections.find(s => s.id === id);
    if (section) {
      appTelemetry.track('engagement_user_guide_section_toggled', {
        section_id: id,
        section_title: section.title,
        expanded: !section.expanded,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    // Track support contact
    appTelemetry.track('engagement_user_guide_support_contacted', {
      timestamp: new Date().toISOString(),
    });
    
    navigation.navigate('Help' as never);
  };

  const handleWhatsNew = () => {
    // Track what's new access
    appTelemetry.track('engagement_user_guide_whats_new_accessed', {
      timestamp: new Date().toISOString(),
    });
    
    navigation.navigate('SettingsAbout' as never);
  };

  const layoutStyles = useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: sem.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: getSpacing(sem, 'md'),
      paddingBottom: getScrollBottomInset('settings'),
    },
    section: {
      marginBottom: getSpacing(sem, 'lg'),
    },
    sectionContent: {
      paddingHorizontal: getSpacing(sem, 'md'),
      paddingVertical: getSpacing(sem, 'md'),
      backgroundColor: sem.background.surface,
      borderRadius: sem.radius?.md || 8,
      marginTop: getSpacing(sem, 'xs'),
    } as ViewStyle,
    bulletPoint: {
      marginBottom: getSpacing(sem, 'sm'),
      paddingLeft: getSpacing(sem, 'xs'),
    },
  }), [sem]);

  return (
    <SafeAreaView style={layoutStyles.container} edges={['top']}>
      <SettingsScreenHeader
        title="User Guide"
        onBackPress={handleBack}
        testID="user-guide-screen-header"
      />
      <ScrollView 
        style={layoutStyles.scrollView} 
        contentContainerStyle={layoutStyles.scrollContent}
      >
        {/* Header Section */}
        <View style={layoutStyles.section}>
          <Typography 
            variant="body" 
            style={{ 
              color: sem.text.secondary, 
              marginTop: getSpacing(sem, 'sm'),
              marginBottom: getSpacing(sem, 'md'),
              lineHeight: 22,
            }}
          >
            Learn how to get the most out of Thoughtmarks. Tap any section below to expand and view detailed instructions.
          </Typography>
        </View>

        {/* Guide Sections */}
        {sections.map((section) => (
          <View key={section.id} style={layoutStyles.section}>
            <SettingsListItem
              icon={section.icon as IconKey}
              title={section.title}
              subtitle={section.description}
              onPress={() => toggleSection(section.id)}
              showChevron
              accessibilityLabel={`${section.title} guide section`}
              accessibilityHint={section.expanded ? 'Tap to collapse this section' : 'Tap to expand this section'}
            />
            
            {section.expanded && (
              <View style={layoutStyles.sectionContent}>
                {section.content.map((paragraph, index) => (
                  <View key={`${section.id}-${index}`} style={layoutStyles.bulletPoint}>
                    {renderFormattedText(paragraph, sem, `${section.id}-text-${index}`)}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Help Footer */}
        <View style={[layoutStyles.section, { marginTop: getSpacing(sem, 'xl') }]}>
          <SettingsSectionHeader label="NEED MORE HELP?" />
          <SettingsListItem
            icon={'tm.actions.help' as IconKey}
            title="Contact Support"
            subtitle="Need help? Tap Contact Support to send a message — we reply within 24 hours."
            onPress={handleContactSupport}
            showChevron
            accessibilityLabel="Contact Support guide section"
          />
          <SettingsListItem
            icon={'tm.actions.info' as IconKey}
            title="What's New"
            subtitle="See what's changed in the latest release: new features, performance updates, and sneak peeks of upcoming tools."
            onPress={handleWhatsNew}
            showChevron
            accessibilityLabel="What's New guide section"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
