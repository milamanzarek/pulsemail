#!/usr/bin/env python3
"""
PulseMail CLI Exporter
Compile template JSON into production, Gmail-ready inline-CSS responsive HTML.
Usage:
    python3 export_cli.py [template.json] [-o output.html]
"""

import sys
import os
import json
import argparse

def escape_html(text):
    if text is None:
        return ""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#039;")
    )

def render_email(data):
    subject = data.get("subject", "PulseMail Newsletter")
    preheader = data.get("preheader", "")
    brand = data.get("brand", {})
    blocks = data.get("blocks", [])

    body_bg = brand.get("canvasBg", "#f1f5f9")
    card_bg = brand.get("cardBg", "#ffffff")
    primary = brand.get("primary", "#2563eb")
    accent = brand.get("accent", "#f59e0b")
    text_color = brand.get("textColor", "#1e293b")
    font_family = brand.get("fontFamily", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif")
    radius = brand.get("borderRadius", "8px")

    blocks_html = []

    for block in blocks:
        b_type = block.get("type")

        if b_type == "header-classic":
            brand_name = block.get("brandName", brand.get("companyName", "PULSEMAIL"))
            tagline = block.get("tagline", "")
            links = block.get("navLinks", [])
            logo = f'<img src="{brand.get("logoUrl")}" alt="{escape_html(brand_name)}" height="32" style="max-height: 32px; display: block; margin-bottom: 4px;" />' if brand.get("logoUrl") else ""
            nav_html = "".join([
                f'<a href="{l.get("url", "#")}" target="_blank" style="color: #64748b; text-decoration: none; font-size: 13px; font-weight: 600; margin-left: 14px;">{escape_html(l.get("label", ""))}</a>'
                for l in links
            ])
            blocks_html.append(f"""
            <tr>
              <td style="padding: 24px 28px; border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left" valign="middle">
                      {logo}
                      <div style="font-size: 20px; font-weight: 800; color: {primary}; letter-spacing: -0.5px; text-transform: uppercase;">
                        {escape_html(brand_name)}
                      </div>
                      {f'<div style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.8px; margin-top: 2px;">{escape_html(tagline)}</div>' if tagline else ''}
                    </td>
                    <td align="right" valign="middle" class="mobile-center" style="padding-top: 4px;">
                      {nav_html}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>""")

        elif b_type == "header-minimal":
            brand_name = block.get("brandName", brand.get("companyName", "EDITORIAL"))
            issue_label = block.get("issueLabel", "")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 18px 28px; border-bottom: 2px solid {primary}; background-color: #ffffff; text-align: center;">
                <div style="font-size: 15px; font-weight: 800; color: {text_color}; letter-spacing: 1.5px; text-transform: uppercase;">
                  {escape_html(brand_name)}
                </div>
                {f'<div style="font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 1px; margin-top: 4px; text-transform: uppercase;">{escape_html(issue_label)}</div>' if issue_label else ''}
              </td>
            </tr>""")

        elif b_type == "hero-banner":
            eyebrow = block.get("eyebrow", "")
            title = block.get("title", "")
            body = block.get("body", "")
            btn_text = block.get("buttonText", "")
            btn_url = block.get("buttonUrl", "#")
            banner_bg = block.get("bgColor", "#ffffff")
            btn_markup = f"""<div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td align="center" style="background-color: {primary}; border-radius: {radius};">
                        <a href="{btn_url}" target="_blank" class="mobile-full-btn" style="display: inline-block; padding: 13px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: {radius};">
                          {escape_html(btn_text)}
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>""" if btn_text else ""

            blocks_html.append(f"""
            <tr>
              <td style="padding: 36px 28px; background-color: {banner_bg}; text-align: center;" class="mobile-padding">
                {f'<div style="font-size: 12px; font-weight: 800; color: {accent}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">{escape_html(eyebrow)}</div>' if eyebrow else ''}
                <h1 class="mobile-font-lg" style="margin: 0 0 16px 0; font-size: 28px; line-height: 34px; font-weight: 800; color: {text_color}; letter-spacing: -0.5px;">
                  {escape_html(title)}
                </h1>
                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #475569; max-width: 520px; display: inline-block;">
                  {escape_html(body)}
                </p>
                {btn_markup}
              </td>
            </tr>""")

        elif b_type == "video-card":
            video_url = block.get("videoUrl", "#")
            thumb = block.get("thumbnailUrl", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80")
            title = block.get("videoTitle", "Watch Video")
            duration = block.get("duration", "10:00")
            caption = block.get("caption", "")
            play_style = block.get("playStyle", "red")
            play_bg = "#dc2626" if play_style == "red" else ("#2563eb" if play_style == "blue" else "#0f172a")

            blocks_html.append(f"""
            <tr>
              <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a href="{video_url}" target="_blank" style="text-decoration: none; display: block;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; border-radius: {radius}; overflow: hidden;">
                          <tr>
                            <td align="center" valign="middle" style="background: linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url('{thumb}') center center / cover no-repeat; height: 260px; padding: 20px;">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: {play_bg}; border-radius: 50%; box-shadow: 0 4px 18px rgba(0,0,0,0.5); margin: 0 auto;">
                                <tr>
                                  <td align="center" valign="middle" style="width: 64px; height: 64px;">
                                    <div style="width: 0; height: 0; border-top: 11px solid transparent; border-bottom: 11px solid transparent; border-left: 18px solid #ffffff; margin-left: 4px;"></div>
                                  </td>
                                </tr>
                              </table>
                              <div style="margin-top: 16px; background: rgba(15, 23, 42, 0.88); display: inline-block; padding: 5px 12px; border-radius: 6px; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">
                                &#9654; WATCH ({escape_html(duration)})
                              </div>
                            </td>
                          </tr>
                        </table>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 12px; text-align: center;">
                      <div style="font-size: 16px; font-weight: 700; color: {text_color}; margin-bottom: 4px;">
                        <a href="{video_url}" target="_blank" style="color: {text_color}; text-decoration: none;">{escape_html(title)}</a>
                      </div>
                      {f'<div style="font-size: 13px; color: #64748b;">{escape_html(caption)}</div>' if caption else ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>""")

        elif b_type == "photo-hero":
            img_url = block.get("imageUrl", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80")
            alt = block.get("altText", "Featured Photo")
            caption = block.get("caption", "")
            link = block.get("linkUrl", "#")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 12px 28px; background-color: #ffffff;" class="mobile-padding">
                <a href="{link}" target="_blank" style="display: block; text-decoration: none;">
                  <img src="{img_url}" alt="{escape_html(alt)}" width="544" class="mobile-stack-img" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: {radius}; display: block;" />
                </a>
                {f'<div style="font-size: 12px; color: #64748b; text-align: center; margin-top: 8px; font-style: italic;">{escape_html(caption)}</div>' if caption else ''}
              </td>
            </tr>""")

        elif b_type == "photo-grid-2":
            img1 = block.get("image1", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600")
            cap1 = block.get("caption1", "")
            img2 = block.get("image2", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600")
            cap2 = block.get("caption2", "")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 16px 28px; background-color: #ffffff;" class="mobile-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="font-size: 0; text-align: center;">
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; margin-bottom: 12px;">
                        <img src="{img1}" width="262" class="mobile-stack-img" style="width: 100%; height: 160px; object-fit: cover; border-radius: {radius}; display: block;" />
                        {f'<div style="font-size: 11px; color: #64748b; margin-top: 6px;">{escape_html(cap1)}</div>' if cap1 else ''}
                      </div>
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; margin-left: 12px; margin-bottom: 12px;">
                        <img src="{img2}" width="262" class="mobile-stack-img" style="width: 100%; height: 160px; object-fit: cover; border-radius: {radius}; display: block;" />
                        {f'<div style="font-size: 11px; color: #64748b; margin-top: 6px;">{escape_html(cap2)}</div>' if cap2 else ''}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>""")

        elif b_type == "cols-2-equal":
            c1 = block.get("col1", {})
            c2 = block.get("col2", {})
            blocks_html.append(f"""
            <tr>
              <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="font-size: 0; text-align: center;">
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: {radius}; overflow: hidden; margin-bottom: 16px;">
                        {f'<img src="{c1.get("image")}" width="262" class="mobile-stack-img" style="width: 100%; height: 140px; object-fit: cover; display: block;" />' if c1.get("image") else ''}
                        <div style="padding: 16px;">
                          {f'<div style="font-size: 10px; font-weight: 800; color: {accent}; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">{escape_html(c1.get("tag", ""))}</div>' if c1.get("tag") else ''}
                          <div style="font-size: 16px; font-weight: 700; color: {text_color}; line-height: 20px; margin-bottom: 8px;">{escape_html(c1.get("title", ""))}</div>
                          <div style="font-size: 13px; line-height: 19px; color: #475569; margin-bottom: 14px;">{escape_html(c1.get("body", ""))}</div>
                          {f'<a href="{c1.get("url", "#")}" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: {primary}; color: #ffffff; font-size: 12px; font-weight: 700; border-radius: {radius}; text-decoration: none;">{escape_html(c1.get("buttonText", "Read"))}</a>' if c1.get("buttonText") else ''}
                        </div>
                      </div>
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 262px; vertical-align: top; text-align: left; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: {radius}; overflow: hidden; margin-left: 12px; margin-bottom: 16px;">
                        {f'<img src="{c2.get("image")}" width="262" class="mobile-stack-img" style="width: 100%; height: 140px; object-fit: cover; display: block;" />' if c2.get("image") else ''}
                        <div style="padding: 16px;">
                          {f'<div style="font-size: 10px; font-weight: 800; color: {accent}; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">{escape_html(c2.get("tag", ""))}</div>' if c2.get("tag") else ''}
                          <div style="font-size: 16px; font-weight: 700; color: {text_color}; line-height: 20px; margin-bottom: 8px;">{escape_html(c2.get("title", ""))}</div>
                          <div style="font-size: 13px; line-height: 19px; color: #475569; margin-bottom: 14px;">{escape_html(c2.get("body", ""))}</div>
                          {f'<a href="{c2.get("url", "#")}" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: {primary}; color: #ffffff; font-size: 12px; font-weight: 700; border-radius: {radius}; text-decoration: none;">{escape_html(c2.get("buttonText", "Read"))}</a>' if c2.get("buttonText") else ''}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>""")

        elif b_type == "cols-3-equal":
            c1 = block.get("col1", {})
            c2 = block.get("col2", {})
            c3 = block.get("col3", {})
            blocks_html.append(f"""
            <tr>
              <td style="padding: 18px 28px; background-color: #ffffff;" class="mobile-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="font-size: 0; text-align: center;">
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; text-align: center; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: {radius}; padding: 16px 12px; margin-bottom: 12px;">
                        <div style="font-size: 22px; margin-bottom: 8px;">{escape_html(c1.get("iconText", "✦"))}</div>
                        <div style="font-size: 14px; font-weight: 700; color: {text_color}; margin-bottom: 4px;">{escape_html(c1.get("title", ""))}</div>
                        <div style="font-size: 12px; line-height: 17px; color: #64748b;">{escape_html(c1.get("body", ""))}</div>
                      </div>
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; text-align: center; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: {radius}; padding: 16px 12px; margin-left: 8px; margin-bottom: 12px;">
                        <div style="font-size: 22px; margin-bottom: 8px;">{escape_html(c2.get("iconText", "★"))}</div>
                        <div style="font-size: 14px; font-weight: 700; color: {text_color}; margin-bottom: 4px;">{escape_html(c2.get("title", ""))}</div>
                        <div style="font-size: 12px; line-height: 17px; color: #64748b;">{escape_html(c2.get("body", ""))}</div>
                      </div>
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 172px; vertical-align: top; text-align: center; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: {radius}; padding: 16px 12px; margin-left: 8px; margin-bottom: 12px;">
                        <div style="font-size: 22px; margin-bottom: 8px;">{escape_html(c3.get("iconText", "⚡"))}</div>
                        <div style="font-size: 14px; font-weight: 700; color: {text_color}; margin-bottom: 4px;">{escape_html(c3.get("title", ""))}</div>
                        <div style="font-size: 12px; line-height: 17px; color: #64748b;">{escape_html(c3.get("body", ""))}</div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>""")

        elif b_type == "cols-4-stats":
            s1 = block.get("stat1", {"number": "$10M", "label": "ARR"})
            s2 = block.get("stat2", {"number": "+120%", "label": "Growth"})
            s3 = block.get("stat3", {"number": "99.9%", "label": "SLA"})
            s4 = block.get("stat4", {"number": "10x", "label": "Speed"})
            blocks_html.append(f"""
            <tr>
              <td style="padding: 24px 28px; background-color: #ffffff;" class="mobile-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="font-size: 0; text-align: center;">
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                        <div style="font-size: 22px; font-weight: 800; color: {primary};">{escape_html(s1.get("number", ""))}</div>
                        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">{escape_html(s1.get("label", ""))}</div>
                      </div>
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                        <div style="font-size: 22px; font-weight: 800; color: {accent};">{escape_html(s2.get("number", ""))}</div>
                        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">{escape_html(s2.get("label", ""))}</div>
                      </div>
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                        <div style="font-size: 22px; font-weight: 800; color: {primary};">{escape_html(s3.get("number", ""))}</div>
                        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">{escape_html(s3.get("label", ""))}</div>
                      </div>
                      <div class="fluid-column" style="display: inline-block; width: 100%; max-width: 128px; vertical-align: top; text-align: center; padding: 8px; margin-bottom: 8px;">
                        <div style="font-size: 22px; font-weight: 800; color: {accent};">{escape_html(s4.get("number", ""))}</div>
                        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">{escape_html(s4.get("label", ""))}</div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>""")

        elif b_type == "text-story":
            title = block.get("title", "")
            body = block.get("body", "")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 24px 28px; background-color: #ffffff;" class="mobile-padding">
                {f'<h2 style="font-size: 20px; font-weight: 800; color: {text_color}; margin: 0 0 12px 0; line-height: 26px;">{escape_html(title)}</h2>' if title else ''}
                <div style="font-size: 15px; line-height: 24px; color: #334155;">
                  {escape_html(body).replace(chr(10) + chr(10), '<br/><br/>')}
                </div>
              </td>
            </tr>""")

        elif b_type == "quote-card":
            quote = block.get("quote", "")
            author = block.get("author", "")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
                <div style="background-color: #f8fafc; border-left: 4px solid {accent}; border-radius: {radius}; padding: 18px 22px;">
                  <p style="margin: 0 0 8px 0; font-size: 15px; font-style: italic; line-height: 22px; color: #334155;">
                    &ldquo;{escape_html(quote)}&rdquo;
                  </p>
                  {f'<div style="font-size: 12px; font-weight: 700; color: #64748b;">— {escape_html(author)}</div>' if author else ''}
                </div>
              </td>
            </tr>""")

        elif b_type == "callout-box":
            title = block.get("title", "")
            body = block.get("body", "")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 16px 28px; background-color: #ffffff;" class="mobile-padding">
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: {radius}; padding: 16px 20px;">
                  {f'<div style="font-size: 14px; font-weight: 700; color: #1e40af; margin-bottom: 4px;">{escape_html(title)}</div>' if title else ''}
                  <div style="font-size: 13px; line-height: 20px; color: #1e3a8a;">{escape_html(body)}</div>
                </div>
              </td>
            </tr>""")

        elif b_type == "cta-button":
            btn_text = block.get("buttonText", "Take Action")
            btn_url = block.get("buttonUrl", "#")
            btn_bg = block.get("bgColor", primary)
            blocks_html.append(f"""
            <tr>
              <td style="padding: 20px 28px; background-color: #ffffff; text-align: center;" class="mobile-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="background-color: {btn_bg}; border-radius: {radius};">
                      <a href="{btn_url}" target="_blank" class="mobile-full-btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: {radius};">
                        {escape_html(btn_text)}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>""")

        elif b_type == "coupon-badge":
            discount = block.get("discount", "20% OFF")
            code = block.get("code", "SAVE20")
            expiry = block.get("expiry", "")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 20px 28px; background-color: #ffffff;" class="mobile-padding">
                <div style="border: 2px dashed {accent}; background-color: #fffbeb; border-radius: {radius}; padding: 20px; text-align: center;">
                  <div style="font-size: 20px; font-weight: 800; color: #b45309; margin-bottom: 4px;">{escape_html(discount)}</div>
                  <div style="display: inline-block; background-color: #ffffff; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 18px; margin: 8px 0; font-family: monospace; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #92400e;">
                    {escape_html(code)}
                  </div>
                  {f'<div style="font-size: 12px; color: #b45309;">{escape_html(expiry)}</div>' if expiry else ''}
                </div>
              </td>
            </tr>""")

        elif b_type == "social-links":
            links = block.get("links", [])
            links_html = " &bull; ".join([
                f'<a href="{l.get("url", "#")}" target="_blank" style="display: inline-block; margin: 0 8px; color: {primary}; font-size: 12px; font-weight: 700; text-decoration: none;">{escape_html(l.get("label", ""))}</a>'
                for l in links
            ])
            blocks_html.append(f"""
            <tr>
              <td style="padding: 18px 28px; background-color: #ffffff; text-align: center; border-top: 1px solid #f1f5f9;">
                <div style="font-size: 12px; color: #64748b;">{links_html}</div>
              </td>
            </tr>""")

        elif b_type == "footer-full":
            comp = block.get("companyName", brand.get("companyName", "Company Inc."))
            addr = block.get("address", "San Francisco, CA")
            unsub = block.get("unsubscribeText", "You are receiving this email because you subscribed.")
            unsub_url = block.get("unsubscribeUrl", "#")
            blocks_html.append(f"""
            <tr>
              <td style="padding: 28px 28px 36px 28px; background-color: #f1f5f9; text-align: center; border-top: 1px solid #e2e8f0;">
                <div style="font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px;">{escape_html(comp)}</div>
                <div style="font-size: 11px; line-height: 18px; color: #64748b; margin-bottom: 12px;">{escape_html(addr)}</div>
                <div style="font-size: 11px; line-height: 18px; color: #94a3b8;">
                  {escape_html(unsub)} <br />
                  <a href="{unsub_url}" target="_blank" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
                </div>
              </td>
            </tr>""")

    rendered_body = "\n".join(blocks_html)

    return f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting" />
  <title>{escape_html(subject)}</title>
  <style type="text/css">
    body, table, td, a {{ -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
    table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
    img {{ -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }}
    body {{ margin: 0 !important; padding: 0 !important; width: 100% !important; }}
    @media only screen and (max-width: 620px) {{
      .email-container {{ width: 100% !important; max-width: 100% !important; }}
      .fluid-column {{ display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; margin-left: 0 !important; }}
      .mobile-padding {{ padding-left: 16px !important; padding-right: 16px !important; }}
      .mobile-stack-img {{ width: 100% !important; height: auto !important; max-width: 100% !important; }}
      .mobile-full-btn {{ display: block !important; width: 100% !important; }}
      .mobile-font-lg {{ font-size: 22px !important; line-height: 28px !important; }}
    }}
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: {body_bg}; font-family: {font_family}; color: {text_color};">
  <div style="display: none; font-size: 1px; color: {body_bg}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    {escape_html(preheader)}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: {body_bg};">
    <tr>
      <td align="center" style="padding: 24px 10px 40px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" id="email-table-root" style="max-width: 600px; margin: 0 auto; background-color: {card_bg}; border-radius: {radius}; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          {rendered_body}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

def main():
    parser = argparse.ArgumentParser(description="Export template JSON to Gmail responsive HTML")
    parser.add_argument("input", nargs="?", default="sample-template.json", help="Path to input template JSON")
    parser.add_argument("-o", "--output", default="newsletter.html", help="Path to output HTML file")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' not found.")
        sys.exit(1)

    with open(args.input, "r", encoding="utf-8") as f:
        data = json.load(f)

    html = render_email(data)

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(html)

    size_kb = round(os.path.getsize(args.output) / 1024, 2)
    print(f"[OK] Compiled successfully to: {args.output}")
    print(f"  File size: {size_kb} KB ({'Safe (<102 KB)' if size_kb < 102 else 'Warning: exceeds 102 KB'})")

if __name__ == "__main__":
    main()
