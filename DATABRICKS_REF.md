Yes! Let me add an API endpoint to start the warehouse for you.

Perfect! Now you can start the warehouse with a simple command:

## 🚀 Start Your Warehouse via API

```bash
curl -X POST http://localhost:3001/api/databricks/warehouses/269d7e6fa2ca7acf/start
```

**Expected response:**
```json
{
  "message": "Warehouse starting...",
  "warehouse_id": "269d7e6fa2ca7acf",
  "note": "It may take 30-60 seconds to fully start"
}
```

### Wait a bit, then check status:

```bash
curl -X POST http://localhost:3001/api/databricks/test-connection
```

After ~30-60 seconds, you should see:
```json
{
  "status": "connected",
  "warehouse": "Myhealth SQL Compute",
  "warehouse_id": "269d7e6fa2ca7acf",
  "state": "RUNNING"  ← ✅ Now running!
}
```

### Bonus: Stop the warehouse when done (to save costs)

```bash
curl -X POST http://localhost:3001/api/databricks/warehouses/269d7e6fa2ca7acf/stop
```

---

**Now you can start the warehouse without accessing Databricks UI!** Just run the start command, wait a minute, and you're ready to create charts.