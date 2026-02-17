import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ChartRenderer } from './ChartRenderer';
import { chartApi } from '../services/chartApi';
import type { ChartConfig, ChartType } from '../types/chart.types';
import { BarChart3, LineChart, PieChart, AreaChart, ScatterChart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function ChartBuilder() {
  const [config, setConfig] = useState<Partial<ChartConfig>>({
    chartType: 'bar',
    dataSource: {
      type: 'query',
      catalog: '',
      schema: '',
    },
    dimensions: {},
    metrics: [],
    filters: [],
    styling: {
      legend: true,
      grid: true,
      theme: 'light',
    },
  });

  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dropdowns data
  const [catalogs, setCatalogs] = useState<string[]>([]);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [loadingSchemas, setLoadingSchemas] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);

  // Load catalogs on mount
  useEffect(() => {
    loadCatalogs();
  }, []);

  // Load schemas when catalog changes
  useEffect(() => {
    if (config.dataSource?.catalog) {
      loadSchemas(config.dataSource.catalog);
    }
  }, [config.dataSource?.catalog]);

  // Load tables when schema changes
  useEffect(() => {
    if (config.dataSource?.catalog && config.dataSource?.schema) {
      loadTables(config.dataSource.catalog, config.dataSource.schema);
    }
  }, [config.dataSource?.catalog, config.dataSource?.schema]);

  const loadCatalogs = async () => {
    setLoadingCatalogs(true);
    try {
      const data = await chartApi.getCatalogs();
      setCatalogs(data);
    } catch (err: any) {
      console.error('Error loading catalogs:', err);
      setError('Failed to load catalogs. Check your Databricks connection.');
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const loadSchemas = async (catalog: string) => {
    setLoadingSchemas(true);
    setSchemas([]);
    setTables([]);
    try {
      const data = await chartApi.getSchemas(catalog);
      setSchemas(data);
    } catch (err: any) {
      console.error('Error loading schemas:', err);
    } finally {
      setLoadingSchemas(false);
    }
  };

  const loadTables = async (catalog: string, schema: string) => {
    setLoadingTables(true);
    setTables([]);
    try {
      const data = await chartApi.getTables(catalog, schema);
      setTables(data);
    } catch (err: any) {
      console.error('Error loading tables:', err);
    } finally {
      setLoadingTables(false);
    }
  };

  const chartTypes: Array<{ value: ChartType; label: string; icon: any }> = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'area', label: 'Area Chart', icon: AreaChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
  ];

  const handlePreview = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data: any[] = [];
      
      if (config.dataSource?.type === 'query' && config.dataSource.customQuery) {
        // Execute custom query
        data = await chartApi.executeQuery(config.dataSource.customQuery);
      } else if (config.dataSource?.type === 'table' && config.dataSource.table) {
        // Build and execute table query
        const { catalog, schema, table } = config.dataSource;
        const query = `SELECT * FROM ${catalog}.${schema}.${table} LIMIT 100`;
        data = await chartApi.executeQuery(query);
      } else {
        setError('Please configure a data source (table or query)');
        return;
      }

      if (!data || data.length === 0) {
        setError('Query returned no data');
        return;
      }

      setPreviewData(data);
    } catch (err: any) {
      console.error('Error fetching preview:', err);
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!config.name) {
        setError('Please enter a chart name');
        return;
      }
      
      await chartApi.saveChart(config as ChartConfig);
      alert('Chart saved successfully!');
    } catch (err: any) {
      console.error('Error saving chart:', err);
      setError('Failed to save chart');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chart Builder</h1>
          <p className="text-muted-foreground">Create custom charts from your data</p>
        </div>
        <Button>Save Chart</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Chart Configuration</CardTitle>
            <CardDescription>Configure your chart settings</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="data" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="space-y-4">
                <div className="space-y-2">
                  <Label>Chart Name</Label>
                  <Input
                    placeholder="My Chart"
                    value={config.name || ''}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Source</Label>
                  <Select
                    value={config.dataSource?.type}
                    onValueChange={(value: 'table' | 'query') =>
                      setConfig({
                        ...config,
                        dataSource: { ...config.dataSource!, type: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="query">Custom Query</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.dataSource?.type === 'table' && (
                  <>
                    <div className="space-y-2">
                      <Label>Catalog</Label>
                      <Select
                        value={config.dataSource.catalog}
                        onValueChange={(value) =>
                          setConfig({
                            ...config,
                            dataSource: { ...config.dataSource!, catalog: value, schema: '', table: '' },
                          })
                        }
                        disabled={loadingCatalogs}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCatalogs ? "Loading..." : "Select catalog"} />
                        </SelectTrigger>
                        <SelectContent>
                          {catalogs.map((catalog) => (
                            <SelectItem key={catalog} value={catalog}>
                              {catalog}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Schema</Label>
                      <Select
                        value={config.dataSource.schema}
                        onValueChange={(value) =>
                          setConfig({
                            ...config,
                            dataSource: { ...config.dataSource!, schema: value, table: '' },
                          })
                        }
                        disabled={!config.dataSource.catalog || loadingSchemas}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingSchemas ? "Loading..." : "Select schema"} />
                        </SelectTrigger>
                        <SelectContent>
                          {schemas.map((schema) => (
                            <SelectItem key={schema} value={schema}>
                              {schema}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Table</Label>
                      <Select
                        value={config.dataSource.table || ''}
                        onValueChange={(value) =>
                          setConfig({
                            ...config,
                            dataSource: { ...config.dataSource!, table: value },
                          })
                        }
                        disabled={!config.dataSource.schema || loadingTables}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingTables ? "Loading..." : "Select table"} />
                        </SelectTrigger>
                        <SelectContent>
                          {tables.map((table) => (
                            <SelectItem key={table} value={table}>
                              {table}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {config.dataSource?.type === 'query' && (
                  <div className="space-y-2">
                    <Label>SQL Query</Label>
                    <textarea
                      className="w-full min-h-[120px] p-2 border rounded-md font-mono text-sm"
                      placeholder="SELECT * FROM catalog.schema.table LIMIT 100"
                      value={config.dataSource.customQuery || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          dataSource: { ...config.dataSource!, customQuery: e.target.value },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Use LIMIT to keep results manageable
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chart" className="space-y-4">
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {chartTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.value}
                          variant={config.chartType === type.value ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setConfig({ ...config, chartType: type.value })}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>X-Axis Field</Label>
                  <Input
                    placeholder="e.g., date, category"
                    value={config.dimensions?.xAxis || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        dimensions: { ...config.dimensions, xAxis: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Y-Axis Field</Label>
                  <Input
                    placeholder="e.g., value, count"
                    value={config.dimensions?.yAxis || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        dimensions: { ...config.dimensions, yAxis: e.target.value },
                      })
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Show Legend</Label>
                  <input
                    type="checkbox"
                    checked={config.styling?.legend}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        styling: { ...config.styling, legend: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Grid</Label>
                  <input
                    type="checkbox"
                    checked={config.styling?.grid}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        styling: { ...config.styling, grid: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={config.styling?.theme}
                    onValueChange={(value: 'light' | 'dark') =>
                      setConfig({
                        ...config,
                        styling: { ...config.styling, theme: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-2">
              <Button onClick={handlePreview} disabled={isLoading} className="flex-1">
                {isLoading ? 'Loading...' : 'Preview Chart'}
              </Button>
              <Button onClick={handleSave} variant="outline" disabled={!previewData.length}>
                Save Chart
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your chart will look</CardDescription>
          </CardHeader>
          <CardContent>
            {previewData.length > 0 ? (
              <ChartRenderer config={config as ChartConfig} data={previewData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Click "Preview Chart" to see your visualization</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
