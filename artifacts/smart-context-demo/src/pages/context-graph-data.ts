import {
  Building2,
  Cog,
  Database,
  FileText,
  FolderOpen,
  History,
  Mail,
  Package,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type GraphNode = {
  id: string;
  label: string;
  group: 'source' | 'context' | 'evidence' | 'person';
  icon: LucideIcon;
  x: number;
  y: number;
  radius: number;
  detail: string;
  synced: string;
  facts: string[];
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  bend?: number;
  flow?: boolean;
};

export const graphNodes: GraphNode[] = [
  { id: 'sap', label: 'SAP ERP', group: 'source', icon: Database, x: 120, y: 125, radius: 28, detail: 'Enterprise resource planning', synced: '28 Sep 2026, 09:02 AM', facts: ['17 similar opportunities', '11 won opportunities', 'Historical margin: 18.4%'] },
  { id: 'salesforce', label: 'Salesforce CRM', group: 'source', icon: Users, x: 120, y: 280, radius: 28, detail: 'Customer relationship system', synced: '28 Sep 2026, 08:44 AM', facts: ['Account owner: Maya Haddad', '17 similar opportunities'] },
  { id: 'm365', label: 'M365 Email', group: 'source', icon: Mail, x: 120, y: 435, radius: 28, detail: 'Mailbox and request source', synced: '28 Sep 2026, 09:02 AM', facts: ['12 requirements extracted', '8 messages linked to this RFQ'] },
  { id: 'contracts', label: 'Contracts Drive', group: 'source', icon: FolderOpen, x: 120, y: 590, radius: 28, detail: 'Contract repository', synced: '28 Sep 2026, 08:44 AM', facts: ['Clause 14: approval above $100,000', '3 related contract clauses'] },

  { id: 'client', label: 'Northgate Water Authority', group: 'context', icon: Building2, x: 470, y: 110, radius: 34, detail: 'Client account', synced: '28 Sep 2026, 08:44 AM', facts: ['17 similar opportunities', '11 won', '18.4% historical margin'] },
  { id: 'rfq', label: 'Industrial Pump Package RFQ', group: 'context', icon: FileText, x: 470, y: 285, radius: 34, detail: 'Active procurement request', synced: '28 Sep 2026, 09:02 AM', facts: ['Budget band: $100,000–$250,000', 'Due date: 30 September 2026', 'Decision owner: Maya Haddad'] },
  { id: 'maya', label: 'Maya Haddad', group: 'person', icon: UserRound, x: 570, y: 395, radius: 26, detail: 'Procurement decision owner', synced: '28 Sep 2026, 09:02 AM', facts: ['Approval authority: $250,000', 'Team: Strategic procurement'] },
  { id: 'projects', label: 'past projects', group: 'context', icon: History, x: 470, y: 475, radius: 32, detail: 'Comparable Northgate work', synced: '28 Sep 2026, 08:44 AM', facts: ['17 similar opportunities', '11 won', '18.4% historical margin'] },
  { id: 'contract', label: 'Active supply contract', group: 'context', icon: FileText, x: 470, y: 620, radius: 32, detail: 'Commercial terms', synced: '28 Sep 2026, 08:44 AM', facts: ['Clause 14: approval above $100,000', 'Active supplier agreement'] },

  { id: 'pumps', label: 'centrifugal pumps', group: 'evidence', icon: Package, x: 850, y: 110, radius: 30, detail: 'Requested equipment', synced: '28 Sep 2026, 09:02 AM', facts: ['Quantity: 4', 'Specification: 350 m³/h'] },
  { id: 'motors', label: 'motors', group: 'evidence', icon: Cog, x: 850, y: 220, radius: 30, detail: 'Requested equipment', synced: '28 Sep 2026, 09:02 AM', facts: ['Quantity: 4', 'Efficiency class: IE4'] },
  { id: 'panel', label: '11 kV control panel', group: 'evidence', icon: Cog, x: 850, y: 330, radius: 30, detail: 'Requested equipment', synced: '28 Sep 2026, 09:02 AM', facts: ['Quantity: 1', 'Delivery requirement: 14 weeks'] },
  { id: 'suppliers', label: 'Suppliers A / B / D', group: 'evidence', icon: Truck, x: 850, y: 465, radius: 32, detail: 'Candidate supplier set', synced: '28 Sep 2026, 09:02 AM', facts: ['Supplier A: 14 orders', '94% on-time delivery', '0 incidents'] },
  { id: 'quotes', label: 'past quotations', group: 'evidence', icon: History, x: 850, y: 590, radius: 30, detail: 'Commercial evidence', synced: '28 Sep 2026, 08:44 AM', facts: ['6 comparable quotations', 'Median variance: 4.8%'] },
];

export const graphEdges: GraphEdge[] = [
  { id: 'sap-client', from: 'sap', to: 'client', label: 'synced from', bend: -12, flow: true },
  { id: 'sap-quotes', from: 'sap', to: 'quotes', label: 'synced from', bend: 42, flow: true },
  { id: 'sap-suppliers', from: 'sap', to: 'suppliers', label: 'synced from', bend: -35, flow: true },
  { id: 'salesforce-client', from: 'salesforce', to: 'client', label: 'synced from', bend: 28, flow: true },
  { id: 'salesforce-projects', from: 'salesforce', to: 'projects', label: 'synced from', bend: -10, flow: true },
  { id: 'm365-rfq', from: 'm365', to: 'rfq', label: 'synced from', flow: true },
  { id: 'contracts-contract', from: 'contracts', to: 'contract', label: 'synced from', bend: 12, flow: true },
  { id: 'contracts-suppliers', from: 'contracts', to: 'suppliers', label: 'governed by', bend: 36, flow: true },

  { id: 'client-rfq', from: 'client', to: 'rfq', label: 'requested', bend: -58, flow: true },
  { id: 'client-projects', from: 'client', to: 'projects', label: 'history', bend: 54, flow: true },
  { id: 'rfq-pumps', from: 'rfq', to: 'pumps', label: 'requested', bend: -22, flow: true },
  { id: 'rfq-motors', from: 'rfq', to: 'motors', label: 'requested', bend: -12, flow: true },
  { id: 'rfq-panel', from: 'rfq', to: 'panel', label: 'requested', bend: 8, flow: true },
  { id: 'rfq-maya', from: 'rfq', to: 'maya', label: 'owned by', bend: -8 },
  { id: 'projects-suppliers', from: 'projects', to: 'suppliers', label: 'sourced from', flow: true },
  { id: 'suppliers-quotes', from: 'suppliers', to: 'quotes', label: 'quoted', bend: -28, flow: true },
  { id: 'suppliers-pumps', from: 'suppliers', to: 'pumps', label: 'supplied', bend: 28, flow: true },
  { id: 'suppliers-motors', from: 'suppliers', to: 'motors', label: 'supplied', bend: 12, flow: true },
  { id: 'suppliers-panel', from: 'suppliers', to: 'panel', label: 'supplied', bend: -8, flow: true },
];

export const traceSteps = [
  { nodeId: 'm365', title: 'M365 Email', caption: '12 requirements were extracted from the incoming RFQ thread.', edgeId: 'm365-rfq' },
  { nodeId: 'rfq', title: 'Industrial Pump Package RFQ', caption: 'The request resolves to a live procurement decision.', edgeId: 'client-rfq' },
  { nodeId: 'client', title: 'Northgate Water Authority', caption: 'The account connects this request to its operating history.', edgeId: 'client-projects' },
  { nodeId: 'projects', title: 'past projects', caption: 'Found 17 similar opportunities; 11 were won.', edgeId: 'projects-suppliers' },
  { nodeId: 'suppliers', title: 'Suppliers A / B / D', caption: 'Supplier A shows 94% on-time delivery and no incidents.', edgeId: 'suppliers-quotes' },
  { nodeId: 'quotes', title: 'past quotations', caption: 'Six comparable quotations establish a 4.8% median variance.', edgeId: null },
];

export function findNode(id: string) {
  return graphNodes.find((node) => node.id === id);
}