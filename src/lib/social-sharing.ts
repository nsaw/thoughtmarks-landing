import type { ThoughtmarkWithBin } from "@shared/schema";

export interface ShareableThoughtmark {
  id: number;
  title: string;
  content: string;
  tags: string[];
  binName?: string;
  createdAt: string;
  sharedBy?: string;
  shareUrl?: string;
}

export interface ShareOptions {
  includePersonalInfo: boolean;
  includeTimestamp: boolean;
  includeTags: boolean;
  includeBin: boolean;
}

export class SocialSharingManager {
  generateShareText(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): string {
    let shareText = `💭 ${thoughtmark.title}\n\n`;
    shareText += `${thoughtmark.content}\n\n`;
    
    if (options.includeTags && thoughtmark.tags?.length) {
      shareText += `Tags: ${thoughtmark.tags.join(', ')}\n`;
    }
    
    if (options.includeBin && thoughtmark.binName) {
      shareText += `Collection: ${thoughtmark.binName}\n`;
    }
    
    if (options.includeTimestamp) {
      shareText += `Captured: ${new Date(thoughtmark.createdAt).toLocaleDateString()}\n`;
    }
    
    shareText += `\nShared from Thoughtmarks`;
    
    return shareText;
  }

  private generateShareURL(thoughtmark: ThoughtmarkWithBin): string {
    const baseUrl = window.location.origin;
    const shareId = btoa(`${thoughtmark.id}-${Date.now()}`);
    return `${baseUrl}/share/${shareId}`;
  }

  async shareToClipboard(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): Promise<void> {
    const shareText = this.generateShareText(thoughtmark, options);
    
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  async shareViaWebShare(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): Promise<void> {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    const shareText = this.generateShareText(thoughtmark, options);
    const shareUrl = this.generateShareURL(thoughtmark);

    await navigator.share({
      title: `Thoughtmark: ${thoughtmark.title}`,
      text: shareText,
      url: shareUrl
    });
  }

  shareToX(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    const shareText = this.generateShareText(thoughtmark, options);
    const maxLength = 280 - 25; // Reserve space for URL
    const truncatedText = shareText.length > maxLength 
      ? shareText.substring(0, maxLength - 3) + '...'
      : shareText;
    
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncatedText)}`;
    window.open(xUrl, '_blank', 'width=550,height=420');
  }

  shareToLinkedIn(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    const shareText = this.generateShareText(thoughtmark, options);
    const shareUrl = this.generateShareURL(thoughtmark);
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(thoughtmark.title)}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  }

  shareToFacebook(thoughtmark: ThoughtmarkWithBin): void {
    const shareUrl = this.generateShareURL(thoughtmark);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  }

  shareToInstagram(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    // Instagram doesn't support direct URL sharing for posts, so we copy to clipboard
    const shareText = this.generateShareText(thoughtmark, options);
    navigator.clipboard.writeText(shareText).then(() => {
      // Open Instagram web in a new tab
      window.open('https://www.instagram.com/', '_blank');
    });
  }

  shareToInstagramStories(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    const shareText = this.generateShareText(thoughtmark, options);
    // Instagram Stories sharing requires the mobile app
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      const instagramUrl = `instagram://story-camera`;
      window.location.href = instagramUrl;
    } else {
      navigator.clipboard.writeText(shareText);
      window.open('https://www.instagram.com/stories/', '_blank');
    }
  }

  shareToThreads(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    const shareText = this.generateShareText(thoughtmark, options);
    const maxLength = 500; // Threads character limit
    const truncatedText = shareText.length > maxLength 
      ? shareText.substring(0, maxLength - 3) + '...'
      : shareText;
    
    const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(truncatedText)}`;
    window.open(threadsUrl, '_blank', 'width=550,height=420');
  }

  shareViaEmail(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    const shareText = this.generateShareText(thoughtmark, options);
    const subject = `Thoughtmark: ${thoughtmark.title}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
    window.location.href = emailUrl;
  }

  generateMarkdownForThoughtmark(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): string {
    let markdown = `# ${thoughtmark.title}\n\n`;
    markdown += `${thoughtmark.content}\n\n`;
    
    if (options.includeTags && thoughtmark.tags?.length) {
      markdown += `**Tags:** ${thoughtmark.tags.map(tag => `#${tag}`).join(' ')}\n\n`;
    }
    
    if (options.includeBin && thoughtmark.binName) {
      markdown += `**Collection:** ${thoughtmark.binName}\n\n`;
    }
    
    if (options.includeTimestamp) {
      markdown += `*Captured on ${new Date(thoughtmark.createdAt).toLocaleDateString()}*\n\n`;
    }
    
    markdown += `---\n*Shared from [Thoughtmarks](${window.location.origin})*`;
    
    return markdown;
  }

  async exportForCollaboration(thoughtmarks: ThoughtmarkWithBin[], title: string): Promise<string> {
    let collaborationDoc = `# ${title}\n\n`;
    collaborationDoc += `*Shared thoughtmarks collection*\n\n`;
    
    // Group by bin
    const thoughtmarksByBin = thoughtmarks.reduce((acc, tm) => {
      const binName = tm.binName || 'Uncategorized';
      if (!acc[binName]) acc[binName] = [];
      acc[binName].push(tm);
      return acc;
    }, {} as Record<string, ThoughtmarkWithBin[]>);

    for (const [binName, binThoughtmarks] of Object.entries(thoughtmarksByBin)) {
      collaborationDoc += `## ${binName}\n\n`;
      
      binThoughtmarks.forEach((tm, index) => {
        collaborationDoc += `### ${index + 1}. ${tm.title}\n\n`;
        collaborationDoc += `${tm.content}\n\n`;
        
        if (tm.tags?.length) {
          collaborationDoc += `**Tags:** ${tm.tags.join(', ')}\n\n`;
        }
        
        collaborationDoc += `---\n\n`;
      });
    }
    
    collaborationDoc += `\n*Generated from Thoughtmarks on ${new Date().toLocaleDateString()}*`;
    
    return collaborationDoc;
  }

  createShareableLink(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): ShareableThoughtmark {
    return {
      id: thoughtmark.id,
      title: thoughtmark.title,
      content: thoughtmark.content,
      tags: thoughtmark.tags || [],
      binName: options.includeBin ? thoughtmark.binName : undefined,
      createdAt: options.includeTimestamp ? thoughtmark.createdAt.toString() : '',
      shareUrl: this.generateShareURL(thoughtmark)
    };
  }
}

export const socialSharingManager = new SocialSharingManager();