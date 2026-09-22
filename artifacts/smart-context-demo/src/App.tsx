import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;
const sceneSteps = [7, 2, 4, 5, 4, 9, 11, 7, 3, 8, 5, 5, 4];
const gradientText = { background: 'linear-gradient(90deg,#4ECBDE,#1C77BE)', WebkitBackgroundClip: 'text', color: 'transparent' };
const fireAction = (name: string) => () => window.dispatchEvent(new CustomEvent('smart-context-action', { detail: name }));

function Logo({ invert = false }: { invert?: boolean }) {
  return <span className={`sc-logo ${invert ? 'invert' : ''}`}><span className="logo-mark"><i className="logo-core" /></span><span>Smart Context</span></span>;
}

function Tick({ show = true }: { show?: boolean }) {
  return show ? <motion.span initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .32, ease }} className="tick">✓</motion.span> : null;
}

function WindowBar({ kind = 'smart', title, meta, children }: { kind?: 'smart' | 'outlook' | 'sap'; title?: string; meta?: string; children?: ReactNode }) {
  return <div className={`window-bar ${kind}`}><span className="window-title">{children || title}</span>{meta && <span className="window-meta">{meta}</span>}<span className="window-controls"><i /><i /><i /></span></div>;
}

const mailRows = [
  ['Northgate Water Authority', 'RFQ — Industrial Pump Package', '09:02'],
  ['Flow Group', 'FW: RFX 5500813926', '08:57'],
  ['SCHENCK Procurement', 'Invitation to Negotiation 26-RFQ-28809-3', '08:51'],
  ['Levant Power', 'RFQ — 33KV Switchgear Breakers', '08:44'],
  ['Supplier: HydroTech', 'Re: Revised quotation Q-2291', '08:40'],
  ['Harbour Logistics', 'Delivery note DN-77120', '08:31'],
  ['Aqaba Refinery', 'RFQ — Valves and Fittings, Lot 4', '08:22'],
  ['Supplier: Ferro Steel', 'Quotation — carbon steel pipe', '08:15'],
  ['Desert Mining Co.', 'Clarification request — RFQ 7713', '08:03'],
  ['Finance', 'Invoice scan INV-4410', '07:58'],
  ['Gulf Cement', 'RFQ — Conveyor spares', '07:49'],
  ['Supplier: Pumpworks', 'Price list 2026', '07:41'],
];

function FolderPane({ active = 'Inbox' }: { active?: string }) {
  return <aside className="folder-pane">
    <div className="folder-logo"><span style={{ color: '#0F5CA8', fontWeight: 900 }}>O</span> Outlook</div>
    {['Inbox', 'RFQ intake', 'Quotations', 'Sent', 'Archive'].map((item) => <div key={item} className={`folder-item ${active === item ? 'active' : ''}`}><i className="folder-icon" />{item}{item === 'Inbox' && <span style={{ marginLeft: 'auto', fontSize: 10 }}>12</span>}</div>)}
  </aside>;
}

function MailList({ selected = false, count = 12 }: { selected?: boolean; count?: number }) {
  return <div className="mail-list"><div className="mail-search"><span>⌕</span> Search mail</div>{mailRows.slice(0, count).map(([sender, subject, time], i) => <div key={sender} className={`mail-row ${selected && i === 0 ? 'selected' : ''}`}><span className="mail-sender">{sender}<span className="mail-time">{time}</span></span><span className="mail-subject">{subject}</span></div>)}</div>;
}

function SourceTabs({ count = 6 }: { count?: number }) {
  const tabs = [['EMAIL', '#0F5CA8'], ['PDF', '#D2463B'], ['EXCEL', '#1E7A46'], ['SAP', '#0A6ED1'], ['CRM', '#6B4FBB'], ['SHARED DRIVE', '#E29A1B']];
  return <div className="source-tabs">{tabs.slice(0, count).map(([label, color], i) => <span key={label} style={{ display: 'flex', alignItems: 'center' }}><span className="source-tab" style={{ background: color }}>{label}</span>{i < count - 1 && <span className="source-arrow">→</span>}</span>)}</div>;
}

function OutlookWindow({ step = 0, sidebar = false, selected = false, children }: { step?: number; sidebar?: boolean; selected?: boolean; children?: ReactNode }) {
  return <div className="app-window" style={{ display: 'flex', flexDirection: 'column' }}><WindowBar kind="outlook" title="Outlook" /><div className="outlook-body"><FolderPane /><MailList selected={selected} count={step >= 1 ? 12 : 4} /><div className="reading-pane">{children || <div style={{ paddingTop: 95, textAlign: 'center', color: '#8b99aa', fontSize: 15 }}>Select a message to read</div>}</div>{sidebar && <SmartSidebar step={step} />}</div></div>;
}

function EmailReading({ active = false, scan = false, attachments = 0 }: { active?: boolean; scan?: boolean; attachments?: number }) {
  return <div style={{ position: 'relative', height: '100%' }}>
    {scan && <motion.div initial={{ top: -8 }} animate={{ top: '100%' }} transition={{ duration: 1.4, ease: 'linear' }} className="scan-band" />}
    <div className="reading-head"><div className="eyebrow">INBOX · RFQ INTAKE</div><div className="email-title">RFQ — Industrial Pump Package</div><div className="from-line">From: <b>Northgate Water Authority</b> · procurement@northgate-wa.example · 09:02</div><div className="attachments">{['RFQ.pdf', 'Technical Specifications.pdf', 'Equipment List.xlsx'].map((name, i) => <motion.span key={name} animate={{ backgroundColor: attachments > i ? '#dff8fb' : '#f0f4f8', color: attachments > i ? '#1C77BE' : '#5A6B85' }} className="attachment"><span className="file-icon">{name.endsWith('xlsx') ? 'X' : 'P'}</span>{name}</motion.span>)}</div></div>
    <div className="email-body"><p>Dear Sir / Madam,</p><p>Please quote for the supply of the centrifugal pump package described in the attached specification, including motors and the control panel. Delivery is required within 14 weeks, DDP Aqaba.</p><p>Quotations must be received no later than 30 September 2026.</p><p>Regards,<br />Procurement Department</p></div>
    {active && <div style={{ position: 'absolute', right: 20, bottom: 18, color: '#5A6B85', fontSize: 11 }}>3 attachments · extracted by Smart Context</div>}
  </div>;
}

const extracted = [
  ['Client', 'Northgate Water Authority'],
  ['Items', 'Centrifugal pump package'],
  ['Quantities', '4 pumps · 4 motors'],
  ['Specifications', 'API 610 · 350 m³/h · 11 kV'],
  ['Delivery requirements', '14 weeks · DDP Aqaba'],
  ['Deadline', '30 Sep 2026'],
];

function SmartSidebar({ step }: { step: number }) {
  const review = step >= 2 && step < 6;
  const corrected = step >= 3 && step < 6;
  const confirmed = step >= 4 && step < 6;
  const filled = step >= 6 ? 6 : Math.min(6, Math.max(0, step - 1));
  return <aside className="smart-sidebar">
    <div className="sidebar-head"><Logo /><div className="sidebar-status"><span className={`status-dot ${confirmed ? 'green' : ''}`} style={confirmed ? { background: '#2E9B75' } : undefined} />{confirmed ? 'Confirmed by you' : step === 0 ? 'Reading email and 3 attachments…' : step === 6 ? '6 fields extracted' : review ? 'Waiting for your review' : `${filled} fields extracted`}</div></div>
    <div className="sidebar-fields">{extracted.map(([label, value], i) => {
      const isDelivery = i === 4;
      const isQty = i === 2;
      const visible = i < filled || corrected || confirmed;
      const val = corrected && isQty ? '4 pumps · 4 motors · 1 panel' : value;
      return <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: visible ? 1 : .22, y: 0 }} transition={{ delay: i * .05, duration: .32, ease }} className="sidebar-field">
        <span className="small-label">{label}</span><div className="field-row"><div className={`field-box ${isDelivery && review && !confirmed ? 'focus' : ''} ${isQty && corrected ? 'corrected' : ''}`}>{val}{isQty && corrected && <span className="pill pill-amber" style={{ marginLeft: 'auto' }}>corrected</span>}</div><Tick show={confirmed || (review && !isQty && [0, 1, 3, 4, 5].includes(i))} /></div>
        {isQty && corrected && <div className="correction-note">agent read: <s>4 pumps · 4 motors</s> · fixed by you</div>}
      </motion.div>;
    })}</div>
    <div className="sidebar-foot">{confirmed ? <button onClick={fireAction('approve-sap')} data-testid="button-approve-sap" className="btn btn-amber" style={{ width: '100%' }}>Approve &amp; Create in SAP</button> : <button onClick={fireAction('confirm-extraction')} data-testid="button-confirm-extraction" className="btn btn-blue" style={{ width: '100%' }}>{review ? 'Extraction confirmed ✓' : 'Confirm Extraction'}</button>}</div>
    {step >= 1 && <motion.div className="source-popover" initial={{ opacity: 0, x: 12 }} animate={{ opacity: review && !corrected ? 1 : 0, x: review && !corrected ? 0 : 12 }}><div className="source-name"><span className="file-icon">P</span> Technical Specification · Page 17</div><div className="mini-page"><div className="mini-line" /><div className="mini-line short" /><div className="mini-line" /><div className="mini-line highlight" /><div style={{ color: '#31506b', fontSize: 9, marginTop: -1 }}>4.3 Delivery: 14 weeks from PO, DDP Aqaba</div></div></motion.div>}
    {step >= 5 && <motion.div className="learning-card" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .4, ease }}><div className="learning-title"><span className="learning-icon">↻</span>Learning loop</div><div className="learning-sub">{step >= 5 ? '+5 confirmations · +1 correction' : 'waiting for feedback'}</div>{step >= 5 && <span className="pill pill-green" style={{ position: 'absolute', right: -56, top: 17 }}>Human feedback</span>}</motion.div>}
  </aside>;
}

function Scene1({ step }: { step: number }) {
  const chaosWindows = [
    { cls: 'pdf', title: 'Technical Specifications.pdf', icon: 'P', content: <div className="fake-page"><h3>Technical Specifications</h3><div className="fake-line" /><div className="fake-line short" /><div className="fake-line" /><div className="fake-line" /><div className="fake-line short" /><div className="fake-line" /></div>, caption: 'Download PDF' },
    { cls: 'excel', title: 'Equipment List.xlsx', icon: 'X', content: <div className="fake-grid">{['Part number|Description|Quantity|Unit', 'P-311|Centrifugal pump|4|units', 'P-312|Drive motor|4|units', 'P-313|Control panel|1|unit', 'P-314|Baseplate|4|units'].map((row) => <div className="grid-row" key={row}>{row.split('|').map((v) => <span key={v}>{v}</span>)}</div>)}</div>, caption: 'Open spreadsheet' },
    { cls: 'sap', title: 'Create Inquiry', icon: 'S', content: <div className="sap-form">{['Sold-to party', 'Customer reference', 'Valid to', 'Material', 'Quantity', 'CUST100871'].map((x, i) => <div key={x}><span className="small-label">{x}</span><div className="sap-input">{i === 5 && step >= 4 ? 'CUST100871' : ''}</div></div>)}</div>, caption: 'Switch to SAP' },
    { cls: 'crm', title: 'Accounts — Northgate', icon: 'C', content: <div className="crm-list">{['Maya Haddad', 'Omar Saadeh', 'Procurement'].map((x, i) => <div className="contact-card" key={x}><div className="contact-avatar">{['MH', 'OS', 'P'][i]}</div><b>{x}</b><p>{i === 2 ? 'Northgate Water Authority' : 'Northgate account'}</p></div>)}</div>, caption: 'Check CRM' },
    { cls: 'drive', title: 'Quotes / 2023 / Pumps', icon: 'D', content: <div className="drive-list">{['Pumps_Q_2023_final.xlsx', 'Pumps_Q_2023_final_v2.xlsx', 'Supplier offers — old', 'Northgate RFQ 2022.pdf', 'Margin calc (do not edit).xlsx'].map((x) => <div className="file-row" key={x}><span className="file-icon">F</span><b>{x}</b></div>)}</div>, caption: 'Search old files' },
  ];
  const shown = Math.min(5, Math.max(0, step - 1));
  return <div className="scene-stage light-scene"><SourceTabs count={Math.min(6, 1 + Math.floor(Math.max(0, step) / 2))} /><div className="app-window" style={{ left: '4.2vw', right: '4.2vw', top: '12vh', bottom: '9vh' }}><WindowBar kind="outlook" title="Outlook" /><div className="outlook-body" style={{ height: 'calc(100% - 51px)' }}><FolderPane /><MailList count={step >= 1 ? 12 : 4} /><div className="reading-pane"><div style={{ paddingTop: 70, textAlign: 'center', color: '#8b99aa', fontSize: 14 }}>Inbox · RFQ intake</div></div></div></div><div className="chaos-layer">{chaosWindows.slice(0, shown).map((w, i) => <motion.div key={w.title} initial={{ opacity: 0, x: -20, y: -20 }} animate={{ opacity: 1, x: i * 47 + 70, y: i * 43 + 120 }} transition={{ duration: .5, ease }} className={`chaos-window ${step >= 6 && i === (step - 7) ? 'focused' : ''}`} style={{ zIndex: 10 + i }}><div className={`chaos-title ${w.cls}`}><span>{w.icon}</span>{w.title}</div>{w.content}</motion.div>)}</div>{step >= 6 && <div className="caption">{['Reading…', 'Extracting…', 'Entering…', 'Searching…', 'Comparing…'][Math.min(4, step - 6)]}</div>}</div>;
}

function Scene2({ step }: { step: number }) {
  return <div className="scene-stage light-scene"><div className="source-tabs" style={{ opacity: step >= 0 ? .9 : 0 }}>{[['Email', '#0F5CA8'], ['Documents', '#D2463B'], ['Spreadsheets', '#1E7A46'], ['ERP', '#0A6ED1'], ['CRM', '#6B4FBB'], ['Shared drive', '#E29A1B']].map(([x, color], i) => <span key={x} style={{ display: 'flex', alignItems: 'center' }}><span className="source-tab" style={{ background: color }}>{x}</span>{i < 5 && <span className="source-arrow">→</span>}</span>)}</div><motion.div animate={{ left: step >= 1 ? '4.2vw' : '9vw', right: step >= 1 ? '4.2vw' : '9vw', top: step >= 1 ? '7.4vh' : '16vh', bottom: step >= 1 ? '6.8vh' : '13vh' }} transition={{ duration: .8, ease }} className="app-window"><WindowBar kind="outlook" title="Outlook" /><div className="outlook-body"><FolderPane /><MailList count={12} /><div className="reading-pane"><div style={{ paddingTop: 70, textAlign: 'center', color: '#8b99aa' }}>The information is scattered.</div></div></div></motion.div>{step < 1 && <div className="chaos-layer">{['PDF', 'EXCEL', 'SAP', 'CRM', 'SHARED DRIVE'].map((x, i) => <motion.div key={x} className="pill" initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: i * 120 }} style={{ position: 'absolute', left: `${20 + i * 12}%`, top: `${24 + i * 5}%`, background: 'rgba(255,255,255,.95)', color: '#5A6B85', boxShadow: '0 5px 18px rgba(11,20,55,.15)' }}>{x}</motion.div>)}</div>}</div>;
}

function Scene3({ step }: { step: number }) {
  const scan = step >= 1;
  const attachmentCount = step >= 2 ? 3 : step >= 1 ? 1 : 0;
  const sidebar = step >= 3;
  return <div className="scene-stage light-scene"><OutlookWindow step={sidebar ? 4 : 1} selected><EmailReading active={sidebar} scan={scan} attachments={attachmentCount} />{sidebar && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />}</OutlookWindow>{sidebar && <motion.div initial={{ x: 430 }} animate={{ x: 0 }} transition={{ duration: .55, ease }} style={{ position: 'absolute', top: '7.4vh', right: '4.2vw', bottom: '6.8vh', width: 430 }}><SmartSidebar step={step >= 4 ? 6 : 0} /></motion.div>} {!sidebar && step >= 2 && <div className="caption">Reading attachments…</div>}</div>;
}

function Scene4({ step }: { step: number }) {
  return <div className="scene-stage light-scene"><OutlookWindow step={4} selected><EmailReading active attachments={3} /></OutlookWindow><motion.div initial={{ x: 430 }} animate={{ x: 0 }} className="smart-sidebar" style={{ position: 'absolute', top: '7.4vh', right: '4.2vw', bottom: '6.8vh', height: 'auto' }}><SmartSidebar step={Math.min(5, step)} /></motion.div></div>;
}

function Scene5({ step }: { step: number }) {
  const fieldValues = [['Client', 'Northgate Water Authority (CUST100871)'], ['Items', 'Centrifugal pump package'], ['Quantity', '4 pumps · 4 motors · 1 control panel'], ['Specifications', 'API 610 · 350 m³/h · 11 kV'], ['Delivery', '14 weeks · DDP Aqaba']];
  return <div className="scene-stage light-scene"><div className="app-window"><WindowBar kind="sap" meta="filled by Smart Context · approved by you"><span className="sap-badge">SAP</span></WindowBar><div className="sap-screen"><div className="sap-breadcrumb"><span className="sap-badge">SAP</span><span className="muted" style={{ fontSize: 12 }}>Sales and Distribution / Inquiry</span></div><div className="sap-heading">Create Inquiry</div><div className="sap-card"><div className="eyebrow">HEADER DATA</div><div className="sap-fields">{fieldValues.map(([label, value], i) => <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: i < step + 1 ? 1 : .2, y: 0 }} transition={{ delay: i * .18, duration: .38, ease }} className="sap-field"><span className="small-label">{label}</span><div className="field-row"><div className="field-box">{i < step + 1 ? value : ''}</div><Tick show={i < step + 1} /></div></motion.div>)}</div>{step >= 4 && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="record-banner"><span className="tick">✓</span><span>Record Created</span><span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>Inquiry 10004582</span></motion.div>}</div></div></div></div>;
}

const evidence = [['17', 'Similar opportunities', ''], ['11', 'Previously won', 'green'], ['6', 'Previous client projects', ''], ['18.4%', 'Historical margin', ''], ['1', 'Relevant incident', 'amber'], ['94%', 'Delivery performance', 'green']];
function Scene6({ step }: { step: number }) {
  const compact = step >= 2;
  const count = Math.max(0, Math.min(6, step - 3));
  return <div className="scene-stage light-scene"><div className="app-window"><WindowBar title="Data to Decide · RFQ — Industrial Pump Package"><Logo /><span className="window-meta">Northgate Water Authority</span></WindowBar><div className="decision-screen"><motion.div animate={{ height: compact ? '30%' : '62%' }} transition={{ duration: .7, ease }} className="decision-hero"><motion.h1 animate={{ fontSize: compact ? 31 : 70 }} transition={{ duration: .7, ease }} className="decision-question">SHOULD WE <span style={gradientText}>PURSUE?</span></motion.h1>{compact && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="decision-context">Building decision context…<div className="progress"><motion.span initial={{ width: '12%' }} animate={{ width: step >= 3 ? `${Math.min(100, count * 17)}%` : '40%' }} /></div></motion.div>}</motion.div>{count > 0 && <div className="evidence-grid">{evidence.slice(0, count).map(([value, label, kind]) => <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, ease }} className={`evidence-card ${kind}`}><div className="evidence-value">{value}</div><div className="evidence-label">{label}</div></motion.div>)}</div>}{step >= 9 && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="suggestion"><span className="tick">✓</span><strong>Suggested: Pursue</strong><span>Strong win history with this client and healthy margins. One past incident to account for.</span><span className="view">View Evidence →</span></motion.div>}</div></div></div>;
}

const nodes = ['EMAIL', 'ERP / SAP', 'CRM', 'CONTRACTS', 'DOCUMENTS', 'PAST DEALS', 'PRICING', 'SUPPLIER RECORDS'];
function Engine({ small = false, nodesVisible = 8 }: { small?: boolean; nodesVisible?: number }) {
  const positions = [[50, 13], [71, 20], [85, 40], [82, 64], [65, 78], [35, 78], [18, 64], [15, 40]];
  return <div className={`engine-layout ${small ? 'left' : ''}`} style={{ position: 'absolute', inset: 0 }}><div className="dark-glow" /><div className="engine-core"><Logo invert /><span className="engine-core-label">CONTEXT ENGINE</span></div>{nodes.slice(0, nodesVisible).map((node, i) => <motion.div key={node} initial={{ opacity: 0, scale: .84 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .35, ease }} className="engine-node" style={{ left: small ? `${22 + (positions[i][0] - 50) * .48}%` : `${positions[i][0]}%`, top: `${positions[i][1]}%` }}>{node}</motion.div>)}{nodes.slice(0, nodesVisible).map((node, i) => { const [x, y] = positions[i]; const coreX = small ? 22 : 50; const coreY = 46; const dx = (small ? 22 + (x - 50) * .48 : x) - coreX; const dy = y - coreY; const distance = Math.sqrt(dx * dx + dy * dy) * 18; const angle = Math.atan2(dy, dx) * 180 / Math.PI; return <motion.div key={`${node}-line`} initial={{ opacity: 0 }} animate={{ opacity: .75 }} className="engine-line" style={{ width: distance, transform: `rotate(${angle}deg)`, left: `${coreX}%`, top: `${coreY}%` }} />; })}</div>;
}

function Scene7({ step }: { step: number }) {
  const small = step >= 9;
  return <div className="scene-stage dark-scene"><Engine small={small} nodesVisible={Math.max(0, Math.min(8, step - 1))} />{small && <><motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="engine-heading">FROM COMPANY CONTEXT · SUPPLIERS FOR THIS PACKAGE</motion.div>{[['Supplier A', '14 previous orders · 94% on-time delivery'], ['Supplier B', 'Existing agency agreement · Previous price available'], ['Supplier C', '8 previous orders · 87% on-time delivery']].map(([name, text], i) => <motion.div key={name} initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .15, duration: .45, ease }} className={`supplier-card ${step >= 11 && name === 'Supplier B' ? 'highlight' : ''}`} style={{ top: `${36 + i * 17}%` }}><h3>{name}</h3><p>{text}</p></motion.div>)}</>}</div>;
}

function Scene8({ step }: { step: number }) {
  const checks = ['Manufacturers', 'Authorized distributors', 'Certifications', 'Technical compatibility'];
  return <div className="scene-stage dark-scene"><div className="dark-glow" style={{ top: '48%' }} /><div className="research-wrap"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: step >= 0 ? 1 : 0, y: 0 }} className="research-card amber-left"><div className="eyebrow" style={{ color: '#C9772C' }}>INSUFFICIENT INTERNAL CONTEXT</div><div className="research-title">Item 3 · 11 kV control panel</div><div className="research-subtitle">No purchase history · no supplier on record</div></motion.div>{step >= 1 && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="research-arrow">↓</motion.div>}{step >= 1 && <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="research-card green-left"><div className="sc-logo"><span className="logo-mark"><i className="logo-core" /></span><span>DEEP RESEARCH AGENT</span></div><div className="muted" style={{ fontSize: 12, marginTop: 9 }}>Researching outside the enterprise</div><div className="check-list">{checks.map((x, i) => <motion.div key={x} initial={{ opacity: 0, x: -10 }} animate={{ opacity: step >= 2 + i ? 1 : .25, x: 0 }} className="check-row"><Tick show={step >= 2 + i} />{x}</motion.div>)}</div></motion.div>}{step >= 6 && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="result-card"><h3><span className="tick" style={{ marginRight: 8 }}>✓</span>New supplier found · Supplier D</h3><p>Authorized distributor · IEC certified · Compatible with 11 kV spec</p><span className="pill pill-lilac">EXTERNAL RESEARCH</span></motion.div>}</div></div>;
}

function Scene9({ step }: { step: number }) {
  const sent = step >= 2;
  const suppliers = ['Supplier A', 'Supplier B', 'Supplier D'];
  return <div className="scene-stage light-scene"><div className="app-window"><WindowBar><Logo /><span style={{ marginLeft: 8 }}>Request for Quotation · Industrial Pump Package</span></WindowBar><div className="rfq-body"><div className="column-card"><div className="column-title">SUPPLIERS</div>{suppliers.map((s) => <div className="supplier-row" key={s}><Tick />{s}<span className="muted" style={{ fontSize: 10, marginLeft: 'auto' }}>{s === 'Supplier D' ? 'external research' : 'company context'}</span></div>)}<div className="rfq-actions"><button data-testid="button-generate-rfqs" className="btn btn-blue">{sent ? 'RFQs generated' : 'Generate RFQs'}</button></div></div><div className="drafts">{step >= 1 ? suppliers.map((s, i) => <motion.div key={s} initial={{ opacity: 0, y: 14 }} animate={{ opacity: sent ? 0 : 1, y: sent ? -130 - i * 30 : 0 }} transition={{ duration: .5, delay: i * .08, ease }} className="draft-card"><div className="draft-top"><span>To: {s}</span><span className="pill pill-blue">draft · ready for approval</span></div><div className="draft-subject">Request for Quotation — Centrifugal Pump Package</div><div className="attachments"><span className="attachment"><span className="file-icon">P</span>Technical Specifications.pdf</span><span className="attachment"><span className="file-icon">X</span>Equipment List.xlsx</span></div></motion.div>) : <div style={{ padding: 40, color: '#8a99ab', textAlign: 'center' }}>RFQ drafts will appear here after generation.</div>}<div className="rfq-actions"><button data-testid="button-approve-send" className={`btn ${sent ? 'btn-green' : 'btn-amber'}`}>{sent ? 'Sent ✓' : 'Approve & Send'}</button></div></div></div></div></div>;
}

const facts = [['Previous price', '$169,000', ''], ['Historical margin', '19.2%', ''], ['Previous orders', '14', ''], ['On-time delivery', '94%', 'green'], ['Incidents', '0', 'green'], ['Agreement', 'Active', 'green']];
function Scene10({ step }: { step: number }) {
  const selected = step >= 1; const count = Math.max(0, Math.min(6, step - 2));
  return <div className="scene-stage light-scene"><div className="app-window"><WindowBar><Logo /><span style={{ marginLeft: 8 }}>Quotations · Industrial Pump Package</span></WindowBar><div className="quotes-layout"><div className="quote-list"><div className="column-title">INCOMING QUOTATIONS</div>{['Supplier A', 'Supplier B', 'Supplier D'].map((s) => <div className={`quote-row ${s === 'Supplier A' && selected ? 'selected' : ''}`} key={s}><h3>{s}</h3><p>Quotation received · 3 files</p><span className="pill pill-green">detected</span></div>)}</div><div className="quote-detail">{step >= 1 && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="offer-card"><div className="eyebrow">CURRENT OFFER · SUPPLIER A</div><div className="offer-price">$184,000</div><div className="offer-line">Centrifugal pump package · 11 weeks · DDP Aqaba</div></motion.div>}{selected && <><div className="facts-title">WHAT WE ALREADY KNOW ABOUT SUPPLIER A</div><div className="facts-grid">{facts.slice(0, count).map(([label, value, kind]) => <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`fact-card ${kind}`}><div className="fact-label">{label}</div><div className="fact-value">{value}</div></motion.div>)}</div></>}</div></div>{step >= 0 && <div className="toast">Quotation Detected</div>}</div></div>;
}

function Scene11({ step }: { step: number }) {
  const rows = [['Price', '$184K', '$176K', '$168K'], ['Lead time', '11 weeks', '15 weeks', '13 weeks'], ['Delivery record', '94%', '82%', 'New'], ['History', 'Active agreement', 'Previous delay', 'No internal history']];
  const insights = ['Supplier B exceeds the required 14-week delivery window.', 'Supplier D has no internal performance history.', 'Supplier A has the strongest historical delivery performance.'];
  return <div className="scene-stage light-scene"><div className="app-window"><WindowBar><Logo /><span style={{ marginLeft: 8 }}>Comparison · Industrial Pump Package</span></WindowBar><div className="comparison"><table className="compare-table"><thead><tr><th /><th>Supplier A</th><th>Supplier B</th><th>Supplier D</th></tr></thead><tbody>{rows.map(([label, a, b, d], i) => <motion.tr key={label} initial={{ opacity: 0 }} animate={{ opacity: i < step + 1 ? 1 : .22 }} transition={{ duration: .35, ease }} className={(step >= 2 && (i === 2 || i === 3)) ? 'context-row' : ''}><td>{label}{step >= 2 && (i === 2 || i === 3) && <span className="row-tag">FROM CONTEXT</span>}</td><td className={i === 1 || i === 2 ? 'value-green' : ''}>{a}</td><td className={i === 1 || i === 3 ? 'value-amber' : ''}>{b}</td><td className={i === 2 || i === 3 ? 'value-grey' : ''}>{d}</td></motion.tr>)}</tbody></table><div className="insight-grid">{insights.slice(0, Math.max(0, step - 2)).map((x, i) => <motion.div key={x} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`insight-card ${i === 1 ? 'grey' : i === 2 ? 'green' : ''}`}>{x}</motion.div>)}</div></div></div></div>;
}

function Scene12({ step }: { step: number }) {
  const selected = step >= 1; const draft = step >= 2; const review = step >= 3; const sent = step >= 4;
  return <div className="scene-stage light-scene"><div className="app-window"><WindowBar><Logo /><span style={{ marginLeft: 8 }}>Decision · Industrial Pump Package</span></WindowBar><div className="decision-layout"><div className="agent-recommendation"><div className="eyebrow">AGENT RECOMMENDATION</div><div className="recommendation-name">Supplier A</div><div className="reason-list">{['Only offer inside the 14-week window with a proven record', '94% on-time across 14 previous orders', 'Active agreement · no incidents'].map((x) => <div className="reason" key={x}><Tick />{x}</div>)}</div><button data-testid="button-select-supplier" className={`btn ${selected ? 'btn-green' : 'btn-blue'}`} style={{ width: '100%' }}>{selected ? 'Supplier A selected by you ✓' : 'Select Supplier A'}</button></div>{draft && <motion.div initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} className="prepared-card"><div className="prepared-head"><div><div className="eyebrow">PREPARED BY THE AGENT</div><div style={{ color: '#5A6B85', fontSize: 12, marginTop: 7 }}>To: sales@supplier-a.example</div></div><span className={`pill ${sent ? 'pill-green' : 'pill-amber'}`}>{sent ? 'SENT' : 'DRAFT · awaiting your review'}</span></div><div className="draft-body"><b>Subject: Centrifugal Pump Package — Selection and Next Steps</b><p>Dear Supplier A team,</p><p>Thank you for your quotation of $184,000 for the centrifugal pump package. We are pleased to confirm your selection, subject to final commercial terms under our existing agreement.</p><p>Please confirm the 11-week delivery, DDP Aqaba, and share the updated technical submittals by Thursday.</p><p>Kind regards,<br />Procurement</p></div><div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 17 }}><button data-testid="button-send-selection" className={`btn ${sent ? 'btn-green' : 'btn-amber'}`}>{sent ? 'Sent ✓' : 'Send'}</button></div>{review && !sent && <motion.div initial={{ top: 0 }} animate={{ top: '100%' }} transition={{ duration: 1.5, ease: 'linear' }} className="reading-band" />}</motion.div>}</div></div></div>;
}

function Scene13({ step }: { step: number }) {
  const words = ['UNDERSTAND', 'RETRIEVE', 'RESEARCH', 'DECIDE', 'ACT', 'LEARN'];
  return <div className="scene-stage dark-scene"><div className="closing-top">ERP · CRM · EMAIL · DOCUMENTS · CONTRACTS · ENTERPRISE DATA · EXTERNAL KNOWLEDGE</div>{step < 1 && <><Engine nodesVisible={0} />{words.map((word, i) => <span key={word} className="closing-word" style={{ left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 25}%`, top: `${46 + Math.sin((i / 6) * Math.PI * 2) * 29}%`, transform: 'translate(-50%,-50%)' }}>{word}</span>)}</>}{step >= 1 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="closing-message">YOUR COMPANY ALREADY HAS THE KNOWLEDGE.{step >= 2 && <div className="line2 gradient-text">NOW YOUR AGENTS HAVE THE CONTEXT TO USE IT.</div>}</motion.div>}{step >= 3 && <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="closing-brand"><Logo invert /></motion.div>}</div>;
}

const timeline = [
  [0, 1, 0], [.3, 1, 1], [4.2, 1, 2], [8.8, 1, 6], [9.6, 1, 7], [14.4, 2, 0], [18.3, 2, 1], [20.9, 3, 0], [21.2, 3, 1], [24.1, 3, 2], [25.4, 3, 2], [26.2, 3, 3], [27.1, 3, 4], [29, 3, 4], [30.2, 4, 0], [30.9, 4, 1], [32.7, 4, 2], [33.8, 4, 3], [35.1, 4, 4], [35.4, 4, 5], [37.9, 5, 0], [38.3, 5, 1], [39.9, 5, 2], [41.8, 5, 4], [42.7, 5, 4], [44, 6, 0], [44.8, 6, 1], [49.1, 6, 2], [52, 6, 3], [52.5, 6, 4], [53.1, 6, 5], [55, 6, 6], [55.9, 6, 7], [56.9, 6, 8], [58.7, 6, 9], [60, 7, 0], [60.4, 7, 1], [64.8, 7, 2], [65.9, 7, 3], [66.6, 7, 4], [67.7, 7, 5], [68.8, 7, 6], [69.6, 7, 7], [70, 7, 8], [70.9, 7, 9], [72.8, 7, 9], [75.7, 7, 10], [77.1, 7, 10], [77.9, 7, 10], [79.3, 7, 11], [81.1, 8, 0], [81.6, 8, 0], [83.5, 8, 1], [83.8, 8, 2], [85.2, 8, 5], [85.8, 8, 6], [87, 9, 0], [87.5, 9, 1], [87.9, 9, 2], [90.2, 9, 3], [91.3, 10, 0], [91.6, 10, 1], [93.1, 10, 2], [95.6, 10, 3], [97.3, 10, 4], [98, 10, 5], [98.8, 10, 6], [100.7, 10, 7], [102, 10, 8], [103.5, 11, 0], [104.5, 11, 1], [108, 11, 2], [108.3, 11, 3], [108.7, 11, 4], [109.1, 11, 5], [109.9, 12, 0], [110.2, 12, 1], [113, 12, 2], [114.8, 12, 3], [116.6, 12, 4], [118.4, 12, 5], [119.9, 13, 0], [120, 13, 0], [126.7, 13, 1], [127.5, 13, 2], [130.4, 13, 3], [133.9, 13, 4], [139.2, 13, 4],
] as const;

function RenderScene({ scene, step }: { scene: number; step: number }) {
  switch (scene) {
    case 1: return <Scene1 step={step} />;
    case 2: return <Scene2 step={step} />;
    case 3: return <Scene3 step={step} />;
    case 4: return <Scene4 step={step} />;
    case 5: return <Scene5 step={step} />;
    case 6: return <Scene6 step={step} />;
    case 7: return <Scene7 step={step} />;
    case 8: return <Scene8 step={step} />;
    case 9: return <Scene9 step={step} />;
    case 10: return <Scene10 step={step} />;
    case 11: return <Scene11 step={step} />;
    case 12: return <Scene12 step={step} />;
    case 13: return <Scene13 step={step} />;
    default: return null;
  }
}

function FakePointer({ scene, step }: { scene: number; step: number }) {
  const target = useMemo(() => {
    if (scene === 4) return step === 1 ? [71, 54] : step === 3 ? [82, 87] : [74, 60];
    if (scene === 5) return [75, 88];
    if (scene === 9) return step === 0 ? [27, 83] : [82, 89];
    if (scene === 10) return [25, 46];
    if (scene === 12) return step === 0 ? [28, 78] : [84, 88];
    if (scene === 3) return [70, 35];
    return [50, 50];
  }, [scene, step]);
  const click = (scene === 4 && [1, 3, 4].includes(step)) || (scene === 5 && step === 0) || (scene === 9 && [0, 2].includes(step)) || (scene === 10 && step === 1) || (scene === 12 && [1, 4].includes(step));
  return <><motion.div className="fake-pointer" animate={{ left: `${target[0]}%`, top: `${target[1]}%` }} transition={{ duration: .55, ease }}><svg viewBox="0 0 30 40" aria-hidden="true"><path d="M3 2 L4 32 L12 25 L18 38 L23 35 L17 22 L27 21 Z" fill="#0B1437" stroke="white" strokeWidth="2" strokeLinejoin="round" /></svg></motion.div>{click && <motion.div key={`${scene}-${step}`} initial={{ left: `${target[0]}%`, top: `${target[1]}%`, scale: .35, opacity: .9 }} animate={{ scale: 1.65, opacity: 0 }} transition={{ duration: .65, ease }} className="ripple" />}</>;
}

function App() {
  const [scene, setScene] = useState(1);
  const [step, setStep] = useState(0);
  const [debug, setDebug] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const autoplayStarted = useRef<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const goNext = () => setStep((current) => current < sceneSteps[scene - 1] ? current + 1 : (scene < 13 ? (setScene(scene + 1), 0) : current));
  const goPrevious = () => setStep((current) => current > 0 ? current - 1 : (scene > 1 ? (setScene(scene - 1), sceneSteps[scene - 2]) : 0));
  const jumpScene = (n: number) => { setScene(Math.max(1, Math.min(13, n))); setStep(0); };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.code === 'Space') { event.preventDefault(); goNext(); }
      else if (event.key === 'ArrowLeft') goPrevious();
      else if (event.key.toLowerCase() === 'r') setStep(0);
      else if (event.key.toLowerCase() === 'd') setDebug((v) => !v);
      else if (event.key.toLowerCase() === 'a') setAutoplay((v) => !v);
      else if (event.shiftKey && event.key === '3') jumpScene(13);
      else if (!event.shiftKey && /^[0-9=\-]$/.test(event.key)) {
        const map: Record<string, number> = { '0': 10, '-': 11, '=': 12 };
        jumpScene(map[event.key] || Number(event.key));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!autoplay) { autoplayStarted.current = null; audio.current?.pause(); return; }
    autoplayStarted.current = performance.now();
    const audioEl = new Audio('/voiceover.mp3'); audio.current = audioEl;
    const audioTimer = window.setTimeout(() => { audioEl.currentTime = 0; void audioEl.play().catch(() => undefined); }, 500);
    const timer = window.setInterval(() => {
      const elapsed = (performance.now() - (autoplayStarted.current || performance.now())) / 1000;
      const active = [...timeline].reverse().find(([time]) => elapsed >= time);
      if (active) { setScene(active[1]); setStep(active[2]); }
      if (elapsed >= 139.2) { setAutoplay(false); window.clearInterval(timer); }
    }, 40);
    return () => { window.clearInterval(timer); window.clearTimeout(audioTimer); audioEl.pause(); };
  }, [autoplay]);

  const handleShellClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest('[data-testid]')?.getAttribute('data-testid');
    if (target === 'button-confirm-extraction') setStep(4);
    if (target === 'button-approve-sap') { setScene(5); setStep(0); }
    if (target === 'button-generate-rfqs') setStep(1);
    if (target === 'button-approve-send') setStep(2);
    if (target === 'button-select-supplier') setStep(1);
    if (target === 'button-send-selection') setStep(4);
  };

  return <div className="demo-shell" onClick={handleShellClick}><div className="desk-grain" /><AnimatePresence mode="wait"><motion.div key={scene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25, ease: 'easeOut' }} className="scene-stage"><RenderScene scene={scene} step={step} /></motion.div></AnimatePresence><FakePointer scene={scene} step={step} />{debug && <div className="debug">scene {scene} · step {step} · t={autoplayStarted.current ? ((performance.now() - autoplayStarted.current) / 1000).toFixed(1) : '0.0'}s{autoplay ? ' · autoplay' : ''}</div>}</div>;
}

export default App;