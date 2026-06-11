export interface ConnectorPair {
  id: string;
  left: string;
  right: string;
  color: string;
}

export interface ConnectorData {
  pairs: ConnectorPair[];
  leftLabel: string;
  rightLabel: string;
  rightType: 'text' | 'image';
}
