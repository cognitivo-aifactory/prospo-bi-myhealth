// Chart configuration types
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';
export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';

export interface DataSource {
  type: 'table' | 'query';
  catalog: string;
  schema: string;
  table?: string;
  customQuery?: string;
}

export interface Metric {
  field: string;
  aggregation: AggregationType;
  alias?: string;
}

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface ChartConfig {
  id: string;
  name: string;
  description?: string;
  chartType: ChartType;
  dataSource: DataSource;
  dimensions: {
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
  };
  metrics: Metric[];
  filters: Filter[];
  sorting?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  limit?: number;
  styling?: {
    colors?: string[];
    legend?: boolean;
    grid?: boolean;
    theme?: 'light' | 'dark';
  };
}

export interface TableMetadata {
  catalog: string;
  schema: string;
  name: string;
  columns: ColumnMetadata[];
}

export interface ColumnMetadata {
  name: string;
  type: string;
  nullable: boolean;
}
