/**
 * PulseMail Studio - Core Application Logic
 * Full-featured responsive Gmail newsletter builder, responsive viewer & 1-click rich text copier.
 */

(function() {
  'use strict';

  // --- State ---
  let currentTemplate = null;
  let selectedBlockIndex = -1;
  let activeViewport = 'desktop'; // desktop, tablet, mobile, gmail
  let isDarkModeSim = false;

  // Color palettes
  const PALETTES = {
    tech: {
      primary: '#2563eb',
      accent: '#f59e0b',
      cardBg: '#ffffff',
      canvasBg: '#f1f5f9',
      textColor: '#1e293b'
    },
    creator: {
      primary: '#dc2626',
      accent: '#3b82f6',
      cardBg: '#ffffff',
      canvasBg: '#0f172a',
      textColor: '#1e293b'
    },
    emerald: {
      primary: '#059669',
      accent: '#d97706',
      cardBg: '#ffffff',
      canvasBg: '#f0fdf4',
      textColor: '#064e3b'
    },
    amber: {
      primary: '#d97706',
      accent: '#2563eb',
      cardBg: '#ffffff',
      canvasBg: '#fefce8',
      textColor: '#451a03'
    },
    minimal: {
      primary: '#18181b',
      accent: '#71717a',
      cardBg: '#ffffff',
      canvasBg: '#fafafa',
      textColor: '#09090b'
    },
    corporate: {
      primary: '#1e3a8a',
      accent: '#0284c7',
      cardBg: '#ffffff',
      canvasBg: '#f8fafc',
      textColor: '#0f172a'
    }
  };

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Toast System ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '⚠'}</span>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // --- HTML Rendering Engine for Gmail & Mobile ---
  function renderEmailHtml(data, isLivePreview = false) {
    const subject = data.subject || 'PulseMail Newsletter';
    const preheader = data.preheader || '';
    const brand = data.brand || {};
    const blocks = data.blocks || [];

    const bodyBg = brand.canvasBg || '#f1f5f9';
    const cardBg = brand.cardBg || '#ffffff';
    const primary = brand.primary || '#2563eb';
    const accent = brand.accent || '#f59e0b';
    const textColor = brand.textColor || '#1e293b';
    const fontFamily = brand.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    const radius = brand.borderRadius || '8px';

    const blocksHtml = blocks.map((block, idx) => {
      const bType = block.type;
      const blockId = block.id || `b_${idx}`;
      const isSelected = isLivePreview && idx === selectedBlockIndex;
      const selectOutline = isSelected ? 'outline: 2px solid #2563eb; outline-offset: -2px;' : '';
      const rowAttrs = isLivePreview ? `data-block-index="${idx}" style="cursor: pointer; ${selectOutline}"` : '';

      switch (bType) {
        case 'header-classic': {
          const brandName = block.brandName || brand.companyName || 'PULSEMAIL';
          const tagline = block.tagline || '';
          const links = block.navLinks || [];
          const logo = brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${escapeHtml(brandName)}" height="32" style="max-height: 32px; display: block; margin-bottom: 4px;" />` : '';
          const navHtml = links.map(l =>
            `<a href="${l.url || '#'}" target="_blank" style="color: #64748b; text-decoration: none; font-size: 13px; font-weight: 600; margin-left: 14px;">${escapeHtml(l.label || '')}</a>`
          ).join('');

          return `
          <tr ${rowAttrs}>
            <td style="padding: 24px 28px; border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    ${logo}
                    <div style="font-size: 20px; font-weight: 800; color: ${primary}; letter-spacing: -0.5px; text-transform: uppercase;">
                      ${escapeHtml(brandName)}
                    </div>
                    ${tagline ? `<div style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.8px; margin-top: 2px;">${escapeHtml(tagline)}</div>` : ''}
                  </td>
                  <td align="right" valign="middle" class="mobile-center" style="padding-top: 4px;">
                    ${navHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'header-minimal': {
          const brandName = block.brandName || brand.companyName || 'EDITORIAL';
          const issueLabel = block.issueLabel || '';
          return `
          <tr ${rowAttrs}>
            <td style="padding: 18px 28px; border-bottom: 2px solid ${primary}; background-color: #ffffff; text-align: center;">
              <div style="font-size: 15px; font-weight: 800; color: ${textColor}; letter-spacing: 1.5px; text-transform: uppercase;">
                ${escapeHtml(brandName)}
              </div>
              ${issueLabel ? `<div style="font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 1px; margin-top: 4px; text-transform: uppercase;">${escapeHtml(issueLabel)}</div>` : ''}
            </td>
          </tr>`;
        }

        case 'hero-banner': {
          const eyebrow = block.eyebrow || '';
          const title = block.title || '';
          const body = block.body || '';
          const btnText = block.buttonText || '';
          const btnUrl = block.buttonUrl || '#';
          const bannerBg = block.bgColor || '#ffffff';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 36px 28px; background-color: ${bannerBg}; text-align: center;" class="mobile-padding">
              ${eyebrow ? `<div style="font-size: 12px; font-weight: 800; color: ${accent}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">${escapeHtml(eyebrow)}</div>` : ''}
              <h1 class="mobile-font-lg" style="margin: 0 0 16px 0; font-size: 28px; line-height: 34px; font-weight: 800; color: ${textColor}; letter-spacing: -0.5px; text-wrap: balance;">
                ${escapeHtml(title)}
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #475569; max-width: 520px; display: inline-block; text-wrap: pretty;">
                ${escapeHtml(body)}
              </p>
              ${btnText ? `
              <div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="background-color: ${primary}; border-radius: ${radius};">
                      <a href="${btnUrl}" target="_blank" class="mobile-full-btn" style="display: inline-block; padding: 13px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: ${radius};">
                        ${escapeHtml(btnText)}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>` : ''}
            </td>
          </tr>`;
        }

        case 'video-card': {
          const videoUrl = block.videoUrl || '#';
          const thumb = block.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80';
          const title = block.videoTitle || 'Watch Video';
          const duration = block.duration || '10:00';
          const caption = block.caption || '';
          const playStyle = block.playStyle || 'red';
          const playBg = playStyle === 'red' ? '#dc2626' : (playStyle === 'blue' ? '#2563eb' : '#0f172a');

          return `
          <tr ${rowAttrs}>
            <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${videoUrl}" target="_blank" style="text-decoration: none; display: block;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; border-radius: ${radius}; overflow: hidden;">
                        <tr>
                          <td align="center" valign="middle" style="background: linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url('${thumb}') center center / cover no-repeat; height: 260px; padding: 20px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: ${playBg}; border-radius: 50%; box-shadow: 0 4px 18px rgba(0,0,0,0.5); margin: 0 auto;">
                              <tr>
                                <td align="center" valign="middle" style="width: 64px; height: 64px;">
                                  <div style="width: 0; height: 0; border-top: 11px solid transparent; border-bottom: 11px solid transparent; border-left: 18px solid #ffffff; margin-left: 4px;"></div>
                                </td>
                              </tr>
                            </table>
                            <div style="margin-top: 16px; background: rgba(15, 23, 42, 0.88); display: inline-block; padding: 5px 12px; border-radius: 6px; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">
                              ▶ WATCH (${escapeHtml(duration)})
                            </div>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; text-align: center;">
                    <div style="font-size: 16px; font-weight: 700; color: ${textColor}; margin-bottom: 4px;">
                      <a href="${videoUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">${escapeHtml(title)}</a>
                    </div>
                    ${caption ? `<div style="font-size: 13px; color: #64748b;">${escapeHtml(caption)}</div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'photo-hero': {
          const imgUrl = block.imageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80';
          const alt = block.altText || 'Featured Photo';
          const caption = block.caption || '';
          const link = block.linkUrl || '#';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 12px 28px; background-color: #ffffff;" class="mobile-padding">
              <a href="${link}" target="_blank" style="display: block; text-decoration: none;">
                <img src="${imgUrl}" alt="${escapeHtml(alt)}" width="544" class="mobile-stack-img" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: ${radius}; display: block;" />
              </a>
              ${caption ? `<div style="font-size: 12px; color: #64748b; text-align: center; margin-top: 8px; font-style: italic;">${escapeHtml(caption)}</div>` : ''}
            </td>
          </tr>`;
        }

        case 'photo-grid-2': {
          const img1 = block.image1 || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80';
          const cap1 = block.caption1 || '';
          const img2 = block.image2 || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80';
          const cap2 = block.caption2 || '';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 16px 28px; background-color: #ffffff;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 0; text-align: center;">
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; margin-bottom: 12px;">
                      <img src="${img1}" width="262" class="mobile-stack-img" style="width: 100%; height: 160px; object-fit: cover; border-radius: ${radius}; display: block;" />
                      ${cap1 ? `<div style="font-size: 11px; color: #64748b; margin-top: 6px;">${escapeHtml(cap1)}</div>` : ''}
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; margin-left: 12px; margin-bottom: 12px;">
                      <img src="${img2}" width="262" class="mobile-stack-img" style="width: 100%; height: 160px; object-fit: cover; border-radius: ${radius}; display: block;" />
                      ${cap2 ? `<div style="font-size: 11px; color: #64748b; margin-top: 6px;">${escapeHtml(cap2)}</div>` : ''}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'photo-grid-3': {
          const img1 = block.image1 || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500';
          const img2 = block.image2 || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500';
          const img3 = block.image3 || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 16px 28px; background-color: #ffffff;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 0; text-align: center;">
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; margin-bottom: 8px;">
                      <img src="${img1}" width="172" class="mobile-stack-img" style="width: 100%; height: 120px; object-fit: cover; border-radius: ${radius}; display: block;" />
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; margin-left: 8px; margin-bottom: 8px;">
                      <img src="${img2}" width="172" class="mobile-stack-img" style="width: 100%; height: 120px; object-fit: cover; border-radius: ${radius}; display: block;" />
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; margin-left: 8px; margin-bottom: 8px;">
                      <img src="${img3}" width="172" class="mobile-stack-img" style="width: 100%; height: 120px; object-fit: cover; border-radius: ${radius}; display: block;" />
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'cols-2-equal': {
          const c1 = block.col1 || {};
          const c2 = block.col2 || {};

          return `
          <tr ${rowAttrs}>
            <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 0; text-align: center;">
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: ${radius}; overflow: hidden; margin-bottom: 16px;">
                      ${c1.image ? `<img src="${c1.image}" width="262" class="mobile-stack-img" style="width: 100%; height: 140px; object-fit: cover; display: block;" />` : ''}
                      <div style="padding: 16px;">
                        ${c1.tag ? `<div style="font-size: 10px; font-weight: 800; color: ${accent}; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">${escapeHtml(c1.tag)}</div>` : ''}
                        <div style="font-size: 16px; font-weight: 700; color: ${textColor}; line-height: 20px; margin-bottom: 8px;">${escapeHtml(c1.title || '')}</div>
                        <div style="font-size: 13px; line-height: 19px; color: #475569; margin-bottom: 14px;">${escapeHtml(c1.body || '')}</div>
                        ${c1.buttonText ? `<a href="${c1.url || '#'}" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: ${primary}; color: #ffffff; font-size: 12px; font-weight: 700; border-radius: ${radius}; text-decoration: none;">${escapeHtml(c1.buttonText)}</a>` : ''}
                      </div>
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: ${radius}; overflow: hidden; margin-left: 12px; margin-bottom: 16px;">
                      ${c2.image ? `<img src="${c2.image}" width="262" class="mobile-stack-img" style="width: 100%; height: 140px; object-fit: cover; display: block;" />` : ''}
                      <div style="padding: 16px;">
                        ${c2.tag ? `<div style="font-size: 10px; font-weight: 800; color: ${accent}; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">${escapeHtml(c2.tag)}</div>` : ''}
                        <div style="font-size: 16px; font-weight: 700; color: ${textColor}; line-height: 20px; margin-bottom: 8px;">${escapeHtml(c2.title || '')}</div>
                        <div style="font-size: 13px; line-height: 19px; color: #475569; margin-bottom: 14px;">${escapeHtml(c2.body || '')}</div>
                        ${c2.buttonText ? `<a href="${c2.url || '#'}" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: ${primary}; color: #ffffff; font-size: 12px; font-weight: 700; border-radius: ${radius}; text-decoration: none;">${escapeHtml(c2.buttonText)}</a>` : ''}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'cols-3-equal': {
          const c1 = block.col1 || {};
          const c2 = block.col2 || {};
          const c3 = block.col3 || {};

          return `
          <tr ${rowAttrs}>
            <td style="padding: 18px 28px; background-color: #ffffff;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 0; text-align: center;">
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; text-align: center; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: ${radius}; padding: 16px 12px; margin-bottom: 12px;">
                      <div style="font-size: 22px; margin-bottom: 8px;">${escapeHtml(c1.iconText || '✦')}</div>
                      <div style="font-size: 14px; font-weight: 700; color: ${textColor}; margin-bottom: 4px;">${escapeHtml(c1.title || '')}</div>
                      <div style="font-size: 12px; line-height: 17px; color: #64748b;">${escapeHtml(c1.body || '')}</div>
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; text-align: center; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: ${radius}; padding: 16px 12px; margin-left: 8px; margin-bottom: 12px;">
                      <div style="font-size: 22px; margin-bottom: 8px;">${escapeHtml(c2.iconText || '★')}</div>
                      <div style="font-size: 14px; font-weight: 700; color: ${textColor}; margin-bottom: 4px;">${escapeHtml(c2.title || '')}</div>
                      <div style="font-size: 12px; line-height: 17px; color: #64748b;">${escapeHtml(c2.body || '')}</div>
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; text-align: center; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: ${radius}; padding: 16px 12px; margin-left: 8px; margin-bottom: 12px;">
                      <div style="font-size: 22px; margin-bottom: 8px;">${escapeHtml(c3.iconText || '⚡')}</div>
                      <div style="font-size: 14px; font-weight: 700; color: ${textColor}; margin-bottom: 4px;">${escapeHtml(c3.title || '')}</div>
                      <div style="font-size: 12px; line-height: 17px; color: #64748b;">${escapeHtml(c3.body || '')}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'cols-4-stats': {
          const s1 = block.stat1 || { number: '$10M', label: 'Metric 1' };
          const s2 = block.stat2 || { number: '+120%', label: 'Metric 2' };
          const s3 = block.stat3 || { number: '99.9%', label: 'Metric 3' };
          const s4 = block.stat4 || { number: '10x', label: 'Metric 4' };

          return `
          <tr ${rowAttrs}>
            <td style="padding: 24px 28px; background-color: #ffffff;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 0; text-align: center;">
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                      <div style="font-size: 22px; font-weight: 800; color: ${primary};">${escapeHtml(s1.number)}</div>
                      <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">${escapeHtml(s1.label)}</div>
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                      <div style="font-size: 22px; font-weight: 800; color: ${accent};">${escapeHtml(s2.number)}</div>
                      <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">${escapeHtml(s2.label)}</div>
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                      <div style="font-size: 22px; font-weight: 800; color: ${primary};">${escapeHtml(s3.number)}</div>
                      <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">${escapeHtml(s3.label)}</div>
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                      <div style="font-size: 22px; font-weight: 800; color: ${accent};">${escapeHtml(s4.number)}</div>
                      <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">${escapeHtml(s4.label)}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'cols-magazine': {
          const img = block.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
          const tag = block.tag || 'FEATURE';
          const title = block.title || 'Editorial Feature';
          const body = block.body || 'Deep dive perspective on engineering and architecture.';
          const btnText = block.buttonText || 'Read Story';
          const btnUrl = block.buttonUrl || '#';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 24px 28px; background-color: #ffffff;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 0; text-align: center;">
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 240px; vertical-align: middle; text-align: left; margin-bottom: 12px;">
                      <img src="${img}" width="240" class="mobile-stack-img" style="width: 100%; height: 200px; object-fit: cover; border-radius: ${radius}; display: block;" />
                    </div>
                    <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 280px; vertical-align: middle; text-align: left; margin-left: 16px; margin-bottom: 12px;">
                      ${tag ? `<div style="font-size: 10px; font-weight: 800; color: ${accent}; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">${escapeHtml(tag)}</div>` : ''}
                      <div style="font-size: 18px; font-weight: 700; color: ${textColor}; line-height: 24px; margin-bottom: 8px;">${escapeHtml(title)}</div>
                      <div style="font-size: 13px; line-height: 20px; color: #475569; margin-bottom: 14px;">${escapeHtml(body)}</div>
                      <a href="${btnUrl}" target="_blank" style="display: inline-block; padding: 9px 18px; background-color: ${primary}; color: #ffffff; font-size: 13px; font-weight: 700; border-radius: ${radius}; text-decoration: none;">${escapeHtml(btnText)}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'text-story': {
          const title = block.title || '';
          const body = block.body || '';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 24px 28px; background-color: #ffffff;" class="mobile-padding">
              ${title ? `<h2 style="font-size: 20px; font-weight: 800; color: ${textColor}; margin: 0 0 12px 0; line-height: 26px;">${escapeHtml(title)}</h2>` : ''}
              <div style="font-size: 15px; line-height: 24px; color: #334155; text-wrap: pretty;">
                ${escapeHtml(body).replace(/\n\n/g, '<br/><br/>')}
              </div>
            </td>
          </tr>`;
        }

        case 'quote-card': {
          const quote = block.quote || '';
          const author = block.author || '';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
              <div style="background-color: #f8fafc; border-left: 4px solid ${accent}; border-radius: ${radius}; padding: 18px 22px;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-style: italic; line-height: 22px; color: #334155;">
                  &ldquo;${escapeHtml(quote)}&rdquo;
                </p>
                ${author ? `<div style="font-size: 12px; font-weight: 700; color: #64748b;">— ${escapeHtml(author)}</div>` : ''}
              </div>
            </td>
          </tr>`;
        }

        case 'callout-box': {
          const title = block.title || '';
          const body = block.body || '';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 16px 28px; background-color: #ffffff;" class="mobile-padding">
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: ${radius}; padding: 16px 20px;">
                ${title ? `<div style="font-size: 14px; font-weight: 700; color: #1e40af; margin-bottom: 4px;">${escapeHtml(title)}</div>` : ''}
                <div style="font-size: 13px; line-height: 20px; color: #1e3a8a;">${escapeHtml(body)}</div>
              </div>
            </td>
          </tr>`;
        }

        case 'cta-button': {
          const btnText = block.buttonText || 'Take Action';
          const btnUrl = block.buttonUrl || '#';
          const btnBg = block.bgColor || primary;

          return `
          <tr ${rowAttrs}>
            <td style="padding: 20px 28px; background-color: #ffffff; text-align: center;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="background-color: ${btnBg}; border-radius: ${radius};">
                    <a href="${btnUrl}" target="_blank" class="mobile-full-btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: ${radius};">
                      ${escapeHtml(btnText)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        case 'coupon-badge': {
          const discount = block.discount || '20% OFF';
          const code = block.code || 'SAVE20';
          const expiry = block.expiry || 'Limited time offer';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
              <div style="border: 2px dashed ${accent}; background-color: #fffbeb; border-radius: ${radius}; padding: 20px; text-align: center;">
                <div style="font-size: 20px; font-weight: 800; color: #b45309; margin-bottom: 4px;">${escapeHtml(discount)}</div>
                <div style="display: inline-block; background-color: #ffffff; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 18px; margin: 8px 0; font-family: monospace; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #92400e;">
                  ${escapeHtml(code)}
                </div>
                <div style="font-size: 12px; color: #b45309;">${escapeHtml(expiry)}</div>
              </div>
            </td>
          </tr>`;
        }

        case 'social-links': {
          const links = block.links || [
            { label: 'YouTube', url: 'https://youtube.com' },
            { label: 'X', url: 'https://x.com' },
            { label: 'LinkedIn', url: 'https://linkedin.com' }
          ];

          const linksHtml = links.map(l =>
            `<a href="${l.url || '#'}" target="_blank" style="display: inline-block; margin: 0 8px; color: ${primary}; font-size: 12px; font-weight: 700; text-decoration: none;">${escapeHtml(l.label || '')}</a>`
          ).join(' • ');

          return `
          <tr ${rowAttrs}>
            <td style="padding: 18px 28px; background-color: #ffffff; text-align: center; border-top: 1px solid #f1f5f9;">
              <div style="font-size: 12px; color: #64748b;">${linksHtml}</div>
            </td>
          </tr>`;
        }

        case 'footer-full': {
          const comp = block.companyName || brand.companyName || 'PulseMail Organization';
          const addr = block.address || 'San Francisco, CA';
          const unsub = block.unsubscribeText || 'You received this email because you are registered.';
          const unsubUrl = block.unsubscribeUrl || '#';

          return `
          <tr ${rowAttrs}>
            <td style="padding: 28px 28px 36px 28px; background-color: #f1f5f9; text-align: center; border-top: 1px solid #e2e8f0;">
              <div style="font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px;">${escapeHtml(comp)}</div>
              <div style="font-size: 11px; line-height: 18px; color: #64748b; margin-bottom: 12px;">${escapeHtml(addr)}</div>
              <div style="font-size: 11px; line-height: 18px; color: #94a3b8;">
                ${escapeHtml(unsub)} <br />
                <a href="${unsubUrl}" target="_blank" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
              </div>
            </td>
          </tr>`;
        }

        default:
          return '';
      }
    }).join('\n');

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid-column { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; margin-left: 0 !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-stack-img { width: 100% !important; height: auto !important; max-width: 100% !important; }
      .mobile-full-btn { display: block !important; width: 100% !important; }
      .mobile-font-lg { font-size: 22px !important; line-height: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${bodyBg}; font-family: ${fontFamily}; color: ${textColor};">
  <div style="display: none; font-size: 1px; color: ${bodyBg}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${escapeHtml(preheader)}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${bodyBg};">
    <tr>
      <td align="center" style="padding: 24px 10px 40px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" id="email-table-root" style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border-radius: ${radius}; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          ${blocksHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // Helper: auto-resize iframe to eliminate any clipping
  function resizeIframe() {
    const iframe = document.getElementById('preview-iframe');
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body) return;

      doc.body.style.overflow = 'hidden';
      doc.documentElement.style.overflow = 'hidden';

      const tableRoot = doc.getElementById('email-table-root');
      let targetHeight = 800;
      if (tableRoot && tableRoot.offsetHeight > 0) {
        targetHeight = tableRoot.offsetHeight + 80;
      } else if (doc.body && doc.body.scrollHeight > 0) {
        targetHeight = doc.body.scrollHeight + 60;
      }

      iframe.style.height = targetHeight + 'px';
    } catch (err) {
      console.warn('Iframe resize error:', err);
    }
  }

  // --- UI Update Pipeline ---
  function updatePreview() {
    if (!currentTemplate) return;

    const iframe = document.getElementById('preview-iframe');
    if (!iframe) return;

    const fullHtml = renderEmailHtml(currentTemplate, true);
    iframe.srcdoc = fullHtml;

    // Attach click and auto-resize events inside the iframe after it loads
    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        // Auto-resize immediately
        resizeIframe();

        // Listen for image load events to dynamically expand height
        doc.querySelectorAll('img').forEach(img => {
          if (!img.complete) {
            img.addEventListener('load', resizeIframe);
            img.addEventListener('error', resizeIframe);
          }
        });

        // ResizeObserver inside iframe document
        if (window.ResizeObserver && doc.body) {
          const ro = new ResizeObserver(() => {
            resizeIframe();
          });
          ro.observe(doc.body);
          const tableRoot = doc.getElementById('email-table-root');
          if (tableRoot) ro.observe(tableRoot);
        }

        // Delayed resize checks for web fonts & late layout paints
        setTimeout(resizeIframe, 150);
        setTimeout(resizeIframe, 500);

        const rows = doc.querySelectorAll('[data-block-index]');
        rows.forEach(row => {
          row.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(row.getAttribute('data-block-index'), 10);
            selectBlock(idx);
          });
        });
      } catch (err) {
        console.warn('Could not attach iframe click listeners:', err);
      }
    };

    // Calculate Payload Size
    const rawProdHtml = renderEmailHtml(currentTemplate, false);
    const byteSize = new Blob([rawProdHtml]).size;
    const kbSize = (byteSize / 1024).toFixed(1);

    const statSize = document.getElementById('stat-byte-size');
    if (statSize) {
      statSize.textContent = `${kbSize} KB / 102 KB`;
      statSize.className = byteSize < 104448 ? 'stat-pill safe' : 'stat-pill warn';
    }

    const statCount = document.getElementById('stat-block-count');
    if (statCount) {
      statCount.textContent = currentTemplate.blocks ? currentTemplate.blocks.length : 0;
    }

    const countSections = document.getElementById('count-sections');
    if (countSections) {
      countSections.textContent = currentTemplate.blocks ? currentTemplate.blocks.length : 0;
    }

    // Update Gmail Simulation Header
    const simSubject = document.getElementById('sim-subject');
    if (simSubject) simSubject.textContent = currentTemplate.subject || 'Subject Line';

    const simSender = document.getElementById('sim-sender-name');
    if (simSender) simSender.textContent = currentTemplate.brand.companyName || 'PulseMail Sender';

    const simPreheader = document.getElementById('sim-preheader');
    if (simPreheader) simPreheader.textContent = currentTemplate.preheader || '';

    const simAvatar = document.getElementById('sim-avatar');
    if (simAvatar) {
      const name = currentTemplate.brand.companyName || 'PM';
      simAvatar.textContent = name.substring(0, 2).toUpperCase();
    }

    // Refresh Section Ordering List & Diagnostics
    renderSectionsList();
    renderDiagnostics(byteSize);
  }

  // --- Diagnostics Tab ---
  function renderDiagnostics(byteSize) {
    const panel = document.getElementById('diagnostics-panel');
    if (!panel) return;

    const preheaderLen = (currentTemplate.preheader || '').length;
    const isPreheaderOk = preheaderLen >= 40 && preheaderLen <= 100;
    const isSizeOk = byteSize < 104448;
    const blockCount = (currentTemplate.blocks || []).length;

    panel.innerHTML = `
      <div class="diagnostic-item">
        <div class="diag-icon" style="color: ${isSizeOk ? 'var(--success)' : 'var(--danger)'};">
          ${isSizeOk ? '✓' : '⚠'}
        </div>
        <div>
          <div class="diag-title">Gmail 102 KB Clipping Limit</div>
          <div class="diag-desc">
            Current: ${(byteSize / 1024).toFixed(1)} KB. ${isSizeOk ? 'Safe. Gmail will not truncate this message.' : 'Warning: HTML exceeds 102 KB and will trigger "[Message clipped]".'}
          </div>
        </div>
      </div>

      <div class="diagnostic-item">
        <div class="diag-icon" style="color: ${isPreheaderOk ? 'var(--success)' : 'var(--warning)'};">
          ${isPreheaderOk ? '✓' : 'ℹ'}
        </div>
        <div>
          <div class="diag-title">Preheader Snippet Audit</div>
          <div class="diag-desc">
            Current: ${preheaderLen} chars. ${isPreheaderOk ? 'Optimal length for mobile & desktop inbox snippets.' : 'Ideal preheader length is 40–100 characters for maximum open rates.'}
          </div>
        </div>
      </div>

      <div class="diagnostic-item">
        <div class="diag-icon" style="color: var(--success);">✓</div>
        <div>
          <div class="diag-title">Mobile Responsive Stacking</div>
          <div class="diag-desc">
            All multi-columns use fluid hybrid tables with @media queries for iOS & Android Gmail.
          </div>
        </div>
      </div>

      <div class="diagnostic-item">
        <div class="diag-icon" style="color: var(--success);">✓</div>
        <div>
          <div class="diag-title">Section Count</div>
          <div class="diag-desc">${blockCount} active modular email blocks configured.</div>
        </div>
      </div>
    `;
  }

  // --- Right Sidebar: Selected Block Properties ---
  function selectBlock(index) {
    selectedBlockIndex = index;
    renderSelectedBlockProperties();
    renderSectionsList();

    // Re-render live preview iframe with selection outline
    const iframe = document.getElementById('preview-iframe');
    if (iframe && currentTemplate) {
      iframe.srcdoc = renderEmailHtml(currentTemplate, true);
    }
  }

  function renderSelectedBlockProperties() {
    const container = document.getElementById('selected-block-controls');
    const header = document.getElementById('selected-block-header');
    if (!container || !header) return;

    if (selectedBlockIndex < 0 || !currentTemplate.blocks || !currentTemplate.blocks[selectedBlockIndex]) {
      header.textContent = 'Block Properties';
      container.innerHTML = `
        <div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 12px;">
          Click on any section in the newsletter preview or select from the list below to edit.
        </div>
      `;
      return;
    }

    const block = currentTemplate.blocks[selectedBlockIndex];
    header.textContent = `Edit Block: ${block.type}`;

    let fieldsHtml = '';

    // Generate property inputs based on block type
    if (block.type === 'header-classic' || block.type === 'header-minimal') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Brand / Title</span>
          <input type="text" class="text-input" data-prop="brandName" value="${escapeHtml(block.brandName || '')}">
        </div>
      `;
      if (block.tagline !== undefined) {
        fieldsHtml += `
          <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <span class="form-label">Tagline</span>
            <input type="text" class="text-input" data-prop="tagline" value="${escapeHtml(block.tagline || '')}">
          </div>
        `;
      }
      if (block.issueLabel !== undefined) {
        fieldsHtml += `
          <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <span class="form-label">Issue Label</span>
            <input type="text" class="text-input" data-prop="issueLabel" value="${escapeHtml(block.issueLabel || '')}">
          </div>
        `;
      }
    } else if (block.type === 'hero-banner') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Eyebrow Tag</span>
          <input type="text" class="text-input" data-prop="eyebrow" value="${escapeHtml(block.eyebrow || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Headline</span>
          <input type="text" class="text-input" data-prop="title" value="${escapeHtml(block.title || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Body Text</span>
          <textarea class="text-input" style="height: 60px; resize: vertical;" data-prop="body">${escapeHtml(block.body || '')}</textarea>
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Button Label</span>
          <input type="text" class="text-input" data-prop="buttonText" value="${escapeHtml(block.buttonText || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Button URL</span>
          <input type="text" class="text-input" data-prop="buttonUrl" value="${escapeHtml(block.buttonUrl || '#')}">
        </div>
      `;
    } else if (block.type === 'video-card') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Video URL (YouTube or external)</span>
          <input type="text" class="text-input" data-prop="videoUrl" id="input-video-url" value="${escapeHtml(block.videoUrl || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Thumbnail Image URL</span>
          <input type="text" class="text-input" data-prop="thumbnailUrl" value="${escapeHtml(block.thumbnailUrl || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Video Title</span>
          <input type="text" class="text-input" data-prop="videoTitle" value="${escapeHtml(block.videoTitle || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Duration Badge</span>
          <input type="text" class="text-input" data-prop="duration" value="${escapeHtml(block.duration || '12:45')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Caption / Description</span>
          <input type="text" class="text-input" data-prop="caption" value="${escapeHtml(block.caption || '')}">
        </div>
        <div class="form-row">
          <span class="form-label">Play Button Style</span>
          <select class="select-input" data-prop="playStyle" style="width: 140px;">
            <option value="red" ${block.playStyle === 'red' ? 'selected' : ''}>YouTube Red</option>
            <option value="blue" ${block.playStyle === 'blue' ? 'selected' : ''}>Brand Primary</option>
            <option value="dark" ${block.playStyle === 'dark' ? 'selected' : ''}>Minimal Dark</option>
          </select>
        </div>
      `;
    } else if (block.type === 'photo-hero') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Image URL</span>
          <input type="text" class="text-input" data-prop="imageUrl" value="${escapeHtml(block.imageUrl || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Caption</span>
          <input type="text" class="text-input" data-prop="caption" value="${escapeHtml(block.caption || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Link URL</span>
          <input type="text" class="text-input" data-prop="linkUrl" value="${escapeHtml(block.linkUrl || '#')}">
        </div>
      `;
    } else if (block.type === 'text-story') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Story Title</span>
          <input type="text" class="text-input" data-prop="title" value="${escapeHtml(block.title || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Paragraph Text</span>
          <textarea class="text-input" style="height: 100px; resize: vertical;" data-prop="body">${escapeHtml(block.body || '')}</textarea>
        </div>
      `;
    } else if (block.type === 'quote-card') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Quote</span>
          <textarea class="text-input" style="height: 60px; resize: vertical;" data-prop="quote">${escapeHtml(block.quote || '')}</textarea>
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Author / Attribution</span>
          <input type="text" class="text-input" data-prop="author" value="${escapeHtml(block.author || '')}">
        </div>
      `;
    } else if (block.type === 'cta-button') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Button Text</span>
          <input type="text" class="text-input" data-prop="buttonText" value="${escapeHtml(block.buttonText || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Destination URL</span>
          <input type="text" class="text-input" data-prop="buttonUrl" value="${escapeHtml(block.buttonUrl || '#')}">
        </div>
      `;
    } else if (block.type === 'coupon-badge') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Discount Text</span>
          <input type="text" class="text-input" data-prop="discount" value="${escapeHtml(block.discount || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Promo Code</span>
          <input type="text" class="text-input" data-prop="code" value="${escapeHtml(block.code || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Expiry Note</span>
          <input type="text" class="text-input" data-prop="expiry" value="${escapeHtml(block.expiry || '')}">
        </div>
      `;
    } else if (block.type === 'footer-full') {
      fieldsHtml += `
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Company Name</span>
          <input type="text" class="text-input" data-prop="companyName" value="${escapeHtml(block.companyName || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Address</span>
          <input type="text" class="text-input" data-prop="address" value="${escapeHtml(block.address || '')}">
        </div>
        <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="form-label">Unsubscribe Text</span>
          <input type="text" class="text-input" data-prop="unsubscribeText" value="${escapeHtml(block.unsubscribeText || '')}">
        </div>
      `;
    } else {
      fieldsHtml += `
        <div style="font-size: 11px; color: var(--text-secondary);">
          Properties configured for ${block.type}.
        </div>
      `;
    }

    container.innerHTML = fieldsHtml;

    // Attach listeners to property inputs
    container.querySelectorAll('[data-prop]').forEach(input => {
      input.addEventListener('input', () => {
        const prop = input.getAttribute('data-prop');
        block[prop] = input.value;

        // Auto-fetch YouTube thumbnail if editing videoUrl
        if (prop === 'videoUrl') {
          const ytMatch = input.value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (ytMatch && ytMatch[1]) {
            block.thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
            const thumbInput = container.querySelector('[data-prop="thumbnailUrl"]');
            if (thumbInput) thumbInput.value = block.thumbnailUrl;
          }
        }

        updatePreview();
      });
    });
  }

  // --- Right Sidebar: Section Ordering List ---
  function renderSectionsList() {
    const list = document.getElementById('sections-order-list');
    if (!list || !currentTemplate.blocks) return;

    list.innerHTML = currentTemplate.blocks.map((b, idx) => {
      const isSelected = idx === selectedBlockIndex;
      const title = b.title || b.brandName || b.videoTitle || b.quote || b.companyName || b.type;

      return `
        <div class="section-order-item ${isSelected ? 'active' : ''}" data-index="${idx}">
          <div class="section-order-info">
            <span class="section-order-num">${idx + 1}</span>
            <div class="section-order-text">
              <div class="section-order-title" title="${escapeHtml(title)}">${escapeHtml(title)}</div>
              <div class="section-order-type">${escapeHtml(b.type)}</div>
            </div>
          </div>
          <div class="section-order-actions">
            <button class="reorder-btn move-up" title="Move Up" data-index="${idx}">↑</button>
            <button class="reorder-btn move-down" title="Move Down" data-index="${idx}">↓</button>
            <button class="reorder-btn duplicate-btn" title="Duplicate" data-index="${idx}">⧉</button>
            <button class="reorder-btn delete-btn" title="Delete" data-index="${idx}">✕</button>
          </div>
        </div>
      `;
    }).join('');

    // Click to select
    list.querySelectorAll('.section-order-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.reorder-btn')) return;
        const idx = parseInt(item.getAttribute('data-index'), 10);
        selectBlock(idx);
      });
    });

    // Move Up
    list.querySelectorAll('.move-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (idx > 0) {
          const temp = currentTemplate.blocks[idx];
          currentTemplate.blocks[idx] = currentTemplate.blocks[idx - 1];
          currentTemplate.blocks[idx - 1] = temp;
          selectBlock(idx - 1);
          updatePreview();
        }
      });
    });

    // Move Down
    list.querySelectorAll('.move-down').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (idx < currentTemplate.blocks.length - 1) {
          const temp = currentTemplate.blocks[idx];
          currentTemplate.blocks[idx] = currentTemplate.blocks[idx + 1];
          currentTemplate.blocks[idx + 1] = temp;
          selectBlock(idx + 1);
          updatePreview();
        }
      });
    });

    // Duplicate
    list.querySelectorAll('.duplicate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const clone = JSON.parse(JSON.stringify(currentTemplate.blocks[idx]));
        clone.id = `b_${Date.now()}`;
        currentTemplate.blocks.splice(idx + 1, 0, clone);
        selectBlock(idx + 1);
        updatePreview();
        showToast('Section duplicated');
      });
    });

    // Delete
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        currentTemplate.blocks.splice(idx, 1);
        selectedBlockIndex = Math.min(selectedBlockIndex, currentTemplate.blocks.length - 1);
        selectBlock(selectedBlockIndex);
        updatePreview();
        showToast('Section removed');
      });
    });
  }

  // --- Add Block from Catalog ---
  function addNewBlock(type) {
    if (!currentTemplate) return;

    let newBlock = { id: `b_${Date.now()}`, type: type };

    switch (type) {
      case 'header-classic':
        newBlock.brandName = currentTemplate.brand.companyName || 'BRAND';
        newBlock.tagline = 'WEEKLY DISPATCH';
        newBlock.navLinks = [{ label: 'Stories', url: '#' }, { label: 'About', url: '#' }];
        break;
      case 'header-minimal':
        newBlock.brandName = currentTemplate.brand.companyName || 'EDITORIAL';
        newBlock.issueLabel = 'ISSUE #01';
        break;
      case 'hero-banner':
        newBlock.eyebrow = 'BREAKING UPDATE';
        newBlock.title = 'Crafting Exceptional Digital Experiences';
        newBlock.body = 'Here is the featured narrative for this edition, structured for maximum engagement.';
        newBlock.buttonText = 'Read More →';
        newBlock.buttonUrl = 'https://example.com';
        newBlock.bgColor = '#ffffff';
        break;
      case 'video-card':
        newBlock.videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        newBlock.thumbnailUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80';
        newBlock.videoTitle = 'Featured Video Breakdown';
        newBlock.duration = '10:00';
        newBlock.caption = 'Click to watch our in-depth walkthrough.';
        newBlock.playStyle = 'red';
        break;
      case 'photo-hero':
        newBlock.imageUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80';
        newBlock.altText = 'Hero Photo';
        newBlock.caption = 'Captured on location.';
        newBlock.linkUrl = '#';
        break;
      case 'photo-grid-2':
        newBlock.image1 = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600';
        newBlock.caption1 = 'Photo 1 description';
        newBlock.image2 = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600';
        newBlock.caption2 = 'Photo 2 description';
        break;
      case 'photo-grid-3':
        newBlock.image1 = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500';
        newBlock.image2 = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500';
        newBlock.image3 = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500';
        break;
      case 'cols-2-equal':
        newBlock.col1 = {
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500',
          tag: 'NEWS',
          title: 'Column One Feature',
          body: 'Fluid column that automatically stacks on mobile viewports.',
          buttonText: 'Learn More',
          url: '#'
        };
        newBlock.col2 = {
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
          tag: 'UPDATE',
          title: 'Column Two Feature',
          body: 'Balanced spacing tested across all popular email clients.',
          buttonText: 'Explore',
          url: '#'
        };
        break;
      case 'cols-3-equal':
        newBlock.col1 = { iconText: '🚀', title: 'High Speed', body: 'Optimized render speed.' };
        newBlock.col2 = { iconText: '🛡️', title: 'Secure', body: 'RFC 2822 compliant.' };
        newBlock.col3 = { iconText: '📱', title: 'Responsive', body: 'Fluid on all phones.' };
        break;
      case 'cols-4-stats':
        newBlock.stat1 = { number: '$12M', label: 'Annual Revenue' };
        newBlock.stat2 = { number: '99.9%', label: 'Uptime SLA' };
        newBlock.stat3 = { number: '150k+', label: 'Subscribers' };
        newBlock.stat4 = { number: '4.9★', label: 'User Rating' };
        break;
      case 'cols-magazine':
        newBlock.imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
        newBlock.tag = 'EXCLUSIVE';
        newBlock.title = 'In-Depth Magazine Split Story';
        newBlock.body = 'Editorial visual side-by-side with formatted prose and quick action.';
        newBlock.buttonText = 'Read Essay';
        newBlock.buttonUrl = '#';
        break;
      case 'text-story':
        newBlock.title = 'The Story Behind the Mission';
        newBlock.body = 'Building software with clear architectural intent is the hallmark of enduring engineering teams.';
        break;
      case 'quote-card':
        newBlock.quote = 'Simplicity is prerequisite for reliability.';
        newBlock.author = 'Edsger W. Dijkstra';
        break;
      case 'callout-box':
        newBlock.title = 'Important Notice';
        newBlock.body = 'Please review your account settings before the scheduled system maintenance window.';
        break;
      case 'cta-button':
        newBlock.buttonText = 'Confirm Registration Now →';
        newBlock.buttonUrl = 'https://example.com';
        newBlock.bgColor = currentTemplate.brand.primary || '#2563eb';
        break;
      case 'coupon-badge':
        newBlock.discount = '20% OFF FIRST ORDER';
        newBlock.code = 'PULSE20';
        newBlock.expiry = 'Expires this Sunday at 11:59 PM.';
        break;
      case 'social-links':
        newBlock.links = [
          { label: 'YouTube', url: 'https://youtube.com' },
          { label: 'X', url: 'https://x.com' },
          { label: 'LinkedIn', url: 'https://linkedin.com' }
        ];
        break;
      case 'footer-full':
        newBlock.companyName = currentTemplate.brand.companyName || 'PulseMail Organization';
        newBlock.address = '100 Market St, San Francisco, CA 94105';
        newBlock.unsubscribeText = 'You are receiving this email because you subscribed to our newsletter.';
        newBlock.unsubscribeUrl = '#';
        break;
    }

    currentTemplate.blocks.push(newBlock);
    selectBlock(currentTemplate.blocks.length - 1);
    updatePreview();
    showToast(`Added ${type}`);
  }

  // --- 1-Click Copy for Gmail ---
  async function copyForGmail() {
    if (!currentTemplate) return;

    const rawHtml = renderEmailHtml(currentTemplate, false);

    // Extract table content and body inline styles
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    const tableRoot = doc.getElementById('email-table-root');
    const htmlToCopy = tableRoot ? tableRoot.outerHTML : doc.body.innerHTML;
    const plainText = doc.body.innerText || 'PulseMail Newsletter';

    let success = false;

    // Approach 1: Modern Clipboard API with text/html Blob
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const item = new ClipboardItem({
          'text/html': new Blob([htmlToCopy], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' })
        });
        await navigator.clipboard.write([item]);
        success = true;
      } catch (err) {
        console.warn('ClipboardItem copy failed, falling back:', err);
      }
    }

    // Approach 2: Fallback via hidden contenteditable DOM element
    if (!success) {
      try {
        const container = document.createElement('div');
        container.contentEditable = 'true';
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.innerHTML = htmlToCopy;
        document.body.appendChild(container);

        container.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(container);
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand('copy');
        selection.removeAllRanges();
        document.body.removeChild(container);
        success = true;
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
    }

    if (success) {
      showToast('Copied! Press Ctrl+V in Gmail to paste.', 'success');
      // Open modal guide
      const modal = document.getElementById('modal-gmail-guide');
      const guideCode = document.getElementById('guide-subject-code');
      if (guideCode) guideCode.textContent = currentTemplate.subject || 'Newsletter';
      if (modal) modal.classList.add('active');
    } else {
      showToast('Could not copy automatically. Use HTML export.', 'error');
    }
  }

  // --- Templates Tab List ---
  function renderTemplatesTab() {
    const list = document.getElementById('templates-list');
    if (!list || typeof PRESET_TEMPLATES === 'undefined') return;

    list.innerHTML = PRESET_TEMPLATES.map(tpl => `
      <div class="template-card" data-template-id="${tpl.id}">
        <div class="template-card-header">
          <div class="template-card-title">${escapeHtml(tpl.name)}</div>
          <span class="template-card-badge">${tpl.blocks ? tpl.blocks.length : 0} Blocks</span>
        </div>
        <div class="template-card-desc">${escapeHtml(tpl.description || '')}</div>
      </div>
    `).join('');

    list.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const tplId = card.getAttribute('data-template-id');
        const found = PRESET_TEMPLATES.find(t => t.id === tplId);
        if (found) {
          loadTemplate(JSON.parse(JSON.stringify(found)));
          showToast(`Loaded ${found.name}`);
        }
      });
    });
  }

  // --- Load Template & Populate Form ---
  function loadTemplate(tpl) {
    currentTemplate = tpl;
    selectedBlockIndex = -1;

    // Sync Brand inputs
    const brand = tpl.brand || {};
    syncBrandInput('primary', brand.primary || '#2563eb');
    syncBrandInput('accent', brand.accent || '#f59e0b');
    syncBrandInput('card', brand.cardBg || '#ffffff');
    syncBrandInput('canvas', brand.canvasBg || '#f1f5f9');
    syncBrandInput('text', brand.textColor || '#1e293b');

    const fontInput = document.getElementById('brand-font-family');
    if (fontInput) fontInput.value = brand.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    const radiusInput = document.getElementById('brand-border-radius');
    if (radiusInput) radiusInput.value = brand.borderRadius || '8px';

    const compInput = document.getElementById('brand-company-name');
    if (compInput) compInput.value = brand.companyName || '';

    const logoInput = document.getElementById('brand-logo-url');
    if (logoInput) logoInput.value = brand.logoUrl || '';

    // Sync Subject & Preheader
    const subjectInput = document.getElementById('input-subject-line');
    if (subjectInput) subjectInput.value = tpl.subject || '';

    const preheaderInput = document.getElementById('input-preheader-text');
    if (preheaderInput) preheaderInput.value = tpl.preheader || '';

    updatePreview();
    renderSelectedBlockProperties();
  }

  function syncBrandInput(key, hexVal) {
    const colorInput = document.getElementById(`brand-color-${key}`);
    const hexInput = document.getElementById(`brand-hex-${key}`);
    if (colorInput) colorInput.value = hexVal;
    if (hexInput) hexInput.value = hexVal;
  }

  // --- Event Bindings ---
  function initEvents() {
    // 0. Mobile Bottom View Navigation
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-mobile-view');
        document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.body.className = `view-${view}`;

        if (view === 'blocks') {
          document.querySelector('.tab-btn[data-tab="tab-blocks"]')?.click();
        } else if (view === 'brand') {
          document.querySelector('.tab-btn[data-tab="tab-brand"]')?.click();
        } else if (view === 'preview') {
          setTimeout(resizeIframe, 50);
        }
      });
    });

    // 1. Device Viewport Buttons
    const viewports = [
      { id: 'btn-device-desktop', mode: 'mode-desktop', label: 'Desktop (600px Max)' },
      { id: 'btn-device-tablet', mode: 'mode-tablet', label: 'Tablet (768px)' },
      { id: 'btn-device-mobile', mode: 'mode-mobile', label: 'Mobile (375px)' },
      { id: 'btn-device-gmail', mode: 'mode-gmail', label: 'Gmail Web Simulation' }
    ];

    viewports.forEach(vp => {
      const btn = document.getElementById(vp.id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.header-center-controls .device-btn:not(#btn-toggle-darkmode)').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const frame = document.getElementById('viewport-frame');
        if (frame) {
          frame.className = `viewport-frame ${vp.mode} ${isDarkModeSim ? 'dark-sim' : ''}`;
        }

        const widthLabel = document.getElementById('stat-width-label');
        if (widthLabel) widthLabel.textContent = vp.label;

        setTimeout(resizeIframe, 300);
      });
    });

    window.addEventListener('resize', resizeIframe);

    // Dark Mode Toggle
    const darkBtn = document.getElementById('btn-toggle-darkmode');
    if (darkBtn) {
      darkBtn.addEventListener('click', () => {
        isDarkModeSim = !isDarkModeSim;
        darkBtn.classList.toggle('active', isDarkModeSim);
        const frame = document.getElementById('viewport-frame');
        if (frame) frame.classList.toggle('dark-sim', isDarkModeSim);
      });
    }

    // 2. Left Sidebar Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = document.getElementById(tabId);
        if (panel) panel.classList.add('active');
      });
    });

    // 3. Block Catalog Click
    document.querySelectorAll('.block-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const blockType = card.getAttribute('data-block-type');
        addNewBlock(blockType);
      });
    });

    // 4. Brand Palette Presets
    Object.keys(PALETTES).forEach(key => {
      const btn = document.getElementById(`palette-${key}`);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const pal = PALETTES[key];
        syncBrandInput('primary', pal.primary);
        syncBrandInput('accent', pal.accent);
        syncBrandInput('card', pal.cardBg);
        syncBrandInput('canvas', pal.canvasBg);
        syncBrandInput('text', pal.textColor);
        applyBrandSettings();
        showToast(`Applied ${btn.textContent} palette`);
      });
    });

    // Brand Color Inputs Synchronization
    ['primary', 'accent', 'card', 'canvas', 'text'].forEach(key => {
      const colorInput = document.getElementById(`brand-color-${key}`);
      const hexInput = document.getElementById(`brand-hex-${key}`);

      if (colorInput && hexInput) {
        colorInput.addEventListener('input', () => {
          hexInput.value = colorInput.value;
          applyBrandSettings();
        });
        hexInput.addEventListener('input', () => {
          if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) {
            colorInput.value = hexInput.value;
            applyBrandSettings();
          }
        });
      }
    });

    // Logo Upload
    const logoUpload = document.getElementById('brand-logo-upload');
    if (logoUpload) {
      logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            const logoUrlInput = document.getElementById('brand-logo-url');
            if (logoUrlInput) logoUrlInput.value = dataUrl;
            applyBrandSettings();
            showToast('Logo encoded and uploaded');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Apply Brand Button
    const applyBrandBtn = document.getElementById('btn-apply-brand');
    if (applyBrandBtn) {
      applyBrandBtn.addEventListener('click', () => {
        applyBrandSettings();
        showToast('Brand Kit applied');
      });
    }

    function applyBrandSettings() {
      if (!currentTemplate) return;
      currentTemplate.brand = currentTemplate.brand || {};
      currentTemplate.brand.primary = document.getElementById('brand-color-primary')?.value || '#2563eb';
      currentTemplate.brand.accent = document.getElementById('brand-color-accent')?.value || '#f59e0b';
      currentTemplate.brand.cardBg = document.getElementById('brand-color-card')?.value || '#ffffff';
      currentTemplate.brand.canvasBg = document.getElementById('brand-color-canvas')?.value || '#f1f5f9';
      currentTemplate.brand.textColor = document.getElementById('brand-color-text')?.value || '#1e293b';
      currentTemplate.brand.fontFamily = document.getElementById('brand-font-family')?.value || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      currentTemplate.brand.borderRadius = document.getElementById('brand-border-radius')?.value || '8px';
      currentTemplate.brand.companyName = document.getElementById('brand-company-name')?.value || '';
      currentTemplate.brand.logoUrl = document.getElementById('brand-logo-url')?.value || '';

      updatePreview();
    }

    // 5. Subject & Preheader Inputs
    const subjectInput = document.getElementById('input-subject-line');
    if (subjectInput) {
      subjectInput.addEventListener('input', () => {
        currentTemplate.subject = subjectInput.value;
        updatePreview();
      });
    }

    const preheaderInput = document.getElementById('input-preheader-text');
    if (preheaderInput) {
      preheaderInput.addEventListener('input', () => {
        currentTemplate.preheader = preheaderInput.value;
        updatePreview();
      });
    }

    // 6. Header Action CTAs
    const copyGmailBtn = document.getElementById('btn-copy-gmail');
    if (copyGmailBtn) copyGmailBtn.addEventListener('click', copyForGmail);

    const quickCopyBtn = document.getElementById('btn-quick-copy');
    if (quickCopyBtn) quickCopyBtn.addEventListener('click', copyForGmail);

    // View HTML Modal
    const viewHtmlBtn = document.getElementById('btn-view-html');
    if (viewHtmlBtn) {
      viewHtmlBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-html-view');
        const codeArea = document.getElementById('html-code-area');
        const sizeSpan = document.getElementById('modal-html-filesize');

        const html = renderEmailHtml(currentTemplate, false);
        if (codeArea) codeArea.value = html;
        if (sizeSpan) sizeSpan.textContent = `${(new Blob([html]).size / 1024).toFixed(1)} KB`;
        if (modal) modal.classList.add('active');
      });
    }

    // Copy Raw HTML
    const copyRawBtn = document.getElementById('btn-copy-raw-html');
    if (copyRawBtn) {
      copyRawBtn.addEventListener('click', () => {
        const codeArea = document.getElementById('html-code-area');
        if (codeArea) {
          codeArea.select();
          navigator.clipboard.writeText(codeArea.value);
          showToast('Raw HTML code copied to clipboard');
        }
      });
    }

    // Download HTML
    const downloadHtmlBtn = document.getElementById('btn-download-html');
    if (downloadHtmlBtn) {
      downloadHtmlBtn.addEventListener('click', () => {
        const html = renderEmailHtml(currentTemplate, false);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(currentTemplate.subject || 'newsletter').toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('HTML file downloaded');
      });
    }

    // Export Options Dropdown / Modal
    const exportDropBtn = document.getElementById('btn-export-dropdown');
    if (exportDropBtn) {
      exportDropBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-export-options');
        if (modal) modal.classList.add('active');
      });
    }

    // Download JSON
    const downloadJsonBtn = document.getElementById('btn-download-json');
    if (downloadJsonBtn) {
      downloadJsonBtn.addEventListener('click', () => {
        const jsonStr = JSON.stringify(currentTemplate, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(currentTemplate.subject || 'template').toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Template JSON downloaded');
      });
    }

    // Import JSON
    const importJsonInput = document.getElementById('input-import-json');
    if (importJsonInput) {
      importJsonInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              loadTemplate(data);
              document.getElementById('modal-export-options')?.classList.remove('active');
              showToast('Template loaded from JSON');
            } catch (err) {
              showToast('Invalid template JSON file', 'error');
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // Test Mailto
    const mailtoBtn = document.getElementById('btn-open-mailto');
    if (mailtoBtn) {
      mailtoBtn.addEventListener('click', () => {
        const sub = encodeURIComponent(currentTemplate.subject || 'PulseMail Newsletter');
        const body = encodeURIComponent(`${currentTemplate.preheader || ''}\n\n[Rendered HTML email compiled via PulseMail]`);
        window.location.href = `mailto:?subject=${sub}&body=${body}`;
      });
    }

    // Reset Blank
    const resetBlankBtn = document.getElementById('btn-reset-blank');
    if (resetBlankBtn) {
      resetBlankBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset and start a clean blank newsletter?')) {
          loadTemplate({
            subject: 'New Newsletter',
            preheader: 'A quick preview snippet of this issue.',
            brand: {
              primary: '#2563eb',
              accent: '#f59e0b',
              cardBg: '#ffffff',
              canvasBg: '#f1f5f9',
              textColor: '#1e293b',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              borderRadius: '8px',
              companyName: 'My Brand'
            },
            blocks: []
          });
          document.getElementById('modal-export-options')?.classList.remove('active');
          showToast('Template reset to clean blank');
        }
      });
    }

    // Close Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        if (modalId) {
          document.getElementById(modalId)?.classList.remove('active');
        } else {
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
      });
    });

    // Close modal on overlay background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });
  }

  // --- Initialization ---
  function init() {
    renderTemplatesTab();
    initEvents();

    // Load initial template (default to preset 0: TechPulse Weekly)
    if (typeof PRESET_TEMPLATES !== 'undefined' && PRESET_TEMPLATES.length > 0) {
      loadTemplate(JSON.parse(JSON.stringify(PRESET_TEMPLATES[0])));
    } else {
      loadTemplate({
        subject: 'Welcome to PulseMail',
        preheader: 'Your high performance Gmail newsletter studio.',
        brand: {
          primary: '#2563eb',
          accent: '#f59e0b',
          cardBg: '#ffffff',
          canvasBg: '#f1f5f9',
          textColor: '#1e293b',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          borderRadius: '8px',
          companyName: 'PulseMail'
        },
        blocks: []
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
