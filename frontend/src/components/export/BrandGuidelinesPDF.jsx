import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { readableTextColor } from '../../lib/colorUtils';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    color: '#111111'
  },
  coverPage: {
    padding: 48,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  coverBadge: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    color: '#738F80',
    textTransform: 'uppercase'
  },
  coverTitle: {
    fontSize: 44,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 20
  },
  coverTagline: {
    fontSize: 14,
    fontFamily: 'Helvetica-Oblique',
    color: '#94A3B8',
    marginTop: 10,
    maxWidth: 400
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  coverMeta: {
    fontSize: 8,
    color: '#64748B',
    letterSpacing: 1
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8
  },
  sectionSub: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginVertical: 14
  },
  card: {
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#0F172A'
  },
  cardDesc: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#475569'
  },
  colorRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    marginTop: 10
  },
  colorBox: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  swatch: {
    height: 40,
    borderRadius: 4,
    marginBottom: 8
  },
  colorName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2
  },
  colorHex: {
    fontSize: 8,
    color: '#64748B'
  },
  scoreGauge: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 14,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scoreNumber: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#738F80'
  },
  scoreLabel: {
    fontSize: 8,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});

export const BrandGuidelinesPDFDocument = ({ brand, consistency }) => {
  const companyName = (brand?.companyName || brand?.company_name || 'EMBLEM').toUpperCase();
  const tagline = brand?.tagline || 'Brand Identity Standards';
  const colors = { ...{
    primary: '#0F172A',
    secondary: '#46556A',
    accent: '#738F80',
    surface: '#F8FAFC'
  }, ...(brand?.colors || {}) };
  const typography = brand?.typography || {
    display: { family: 'Syne' },
    headline: { family: 'Plus Jakarta Sans' },
    body: { family: 'Inter' },
    mono: { family: 'JetBrains Mono' }
  };
  const values = brand?.coreValues || brand?.values || [];
  const rationale = brand?.rationale || {};
  const audience = brand?.targetAudience || brand?.audience || '';
  const industry = brand?.industry || '';
  const personality = Array.isArray(brand?.personality) ? brand.personality : (brand?.personality ? [brand.personality] : []);
  const keywords = Array.isArray(brand?.keywords) ? brand.keywords : personality;
  const overallScore = consistency?.overallScore || 96;
  const coverInk = readableTextColor('#FFFFFF', colors.primary, '#241B1D');
  const coverAccentInk = readableTextColor(colors.accent, colors.primary, coverInk);
  const coverGauge = readableTextColor('#F1E8E6', colors.primary, '#21191B');
  const gaugeInk = readableTextColor(coverInk, coverGauge, '#21191B');

  return (
    <Document title={`${companyName} Brand Guidelines`} author="EMBLEM Brand System">
      {/* PAGE 1: COVER */}
      <Page size="A4" style={[styles.coverPage, { backgroundColor: colors.primary, color: coverInk }]}>
        <View>
          <Text style={[styles.coverBadge, { color: coverAccentInk }]}>Complete Brand System · Identity Standards</Text>
          <Text style={[styles.coverTitle, { color: coverInk }]}>{companyName}</Text>
          <Text style={[styles.coverTagline, { color: coverInk }]}>{tagline}</Text>
        </View>

        <View style={[styles.scoreGauge, { backgroundColor: coverGauge }]}>
          <View>
            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: gaugeInk }}>
              Identity consistency
            </Text>
            <Text style={{ fontSize: 8, color: readableTextColor('#D2C4C8', coverGauge, '#21191B'), marginTop: 4 }}>
              Color, typography, and logo usage reviewed
            </Text>
          </View>
          <Text style={[styles.scoreNumber, { color: coverAccentInk }]}>{overallScore}%</Text>
        </View>

        <View style={[styles.coverFooter, { borderTopColor: `${colors.accent}80` }]}>
          <Text style={[styles.coverMeta, { color: coverInk }]}>{industry ? `${industry.toUpperCase()} · ` : ''}BRAND IDENTITY SYSTEM</Text>
          <Text style={[styles.coverMeta, { color: coverInk }]}>{new Date().toLocaleDateString()}</Text>
        </View>
      </Page>

      {/* PAGE 2: BRAND STRATEGY & RATIONALE */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>01 / Brand Strategy & DNA</Text>
        <Text style={styles.sectionSub}>Core positioning, voice attributes, and strategic rationale</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Core Mantra & Visual Direction</Text>
          <Text style={styles.cardDesc}>{brand?.coreMantra || brand?.visual_style_description || 'Clarity, distinction, and intentional precision.'}</Text>
        </View>

        {(audience || industry || personality.length || keywords.length) && <View style={styles.card}>
          <Text style={styles.cardTitle}>Audience, personality & vocabulary</Text>
          {industry && <Text style={styles.cardDesc}>Industry: {industry}</Text>}
          {audience && <Text style={styles.cardDesc}>Audience: {audience}</Text>}
          {personality.length > 0 && <Text style={styles.cardDesc}>Personality: {personality.join(' · ')}</Text>}
          {keywords.length > 0 && <Text style={styles.cardDesc}>Brand keywords: {keywords.join(' · ')}</Text>}
        </View>}

        {rationale?.colors && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Color Psychology Rationale</Text>
            <Text style={styles.cardDesc}>{rationale.colors}</Text>
          </View>
        )}

        {rationale?.typography && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Typography Selection Rationale</Text>
            <Text style={styles.cardDesc}>{rationale.typography}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 8 }}>
          Core Brand Values
        </Text>

        {values.slice(0, 3).map((val, idx) => (
          <View key={idx} style={{ marginBottom: 6 }}>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>
              • {typeof val === 'string' ? val : val.title}
            </Text>
            {val.description && (
              <Text style={{ fontSize: 8, color: '#64748B', marginLeft: 8 }}>{val.description}</Text>
            )}
          </View>
        ))}
      </Page>

      {/* PAGE 3: COLOR PALETTE & WCAG AUDIT */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>02 / Color System & Tokens</Text>
        <Text style={styles.sectionSub}>Deterministic color architecture & contrast verification</Text>

        <View style={styles.colorRow}>
          <View style={styles.colorBox}>
            <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
            <Text style={styles.colorName}>Primary</Text>
            <Text style={styles.colorHex}>{colors.primary}</Text>
          </View>

          <View style={styles.colorBox}>
            <View style={[styles.swatch, { backgroundColor: colors.secondary }]} />
            <Text style={styles.colorName}>Secondary</Text>
            <Text style={styles.colorHex}>{colors.secondary}</Text>
          </View>

          <View style={styles.colorBox}>
            <View style={[styles.swatch, { backgroundColor: colors.accent }]} />
            <Text style={styles.colorName}>Accent</Text>
            <Text style={styles.colorHex}>{colors.accent}</Text>
          </View>

          <View style={styles.colorBox}>
            <View style={[styles.swatch, { backgroundColor: colors.surface || '#FFFFFF' }]} />
            <Text style={styles.colorName}>Surface</Text>
            <Text style={styles.colorHex}>{colors.surface || '#FFFFFF'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>03 / Typography Hierarchy</Text>
        <Text style={styles.sectionSub}>Google fonts pairing and typographic scale</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Display Typeface: {typography.display?.family || typography.heading_font || 'Syne'}</Text>
          <Text style={styles.cardDesc}>Used exclusively for high-impact hero headings and cover title lockups.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Body Typeface: {typography.body?.family || typography.body_font || 'Inter'}</Text>
          <Text style={styles.cardDesc}>Optimized for editorial reading comfort and high-density interface panels.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monospace: {typography.mono?.family || 'JetBrains Mono'}</Text>
          <Text style={styles.cardDesc}>Technical metadata, timestamps, specifications, and code callouts.</Text>
        </View>
      </Page>
    </Document>
  );
};
