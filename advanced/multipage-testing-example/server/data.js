const express = require('express');
const fs = require('fs');
const path = require('path');
const ttest = require( '@stdlib/stats-ttest2' );

const DATA_JSON_PATH = path.join(__dirname, 'data.json');
const dataRouter = express.Router();

// Handle POST requests to /track/** (e.g, /track/events/beacon or /track/testImpressions/bulk)
// Save events and impressions in `./data.json` file
dataRouter.use('/track/*', express.json());
dataRouter.use('/track/*', express.raw({ type: '*/*' }));
dataRouter.post('/track/*', (req, res) => {
  console.log('Received POST request to ' + req.url);

  const items = req.headers['content-type'] === 'application/json' ?
    req.body :
    JSON.parse(req.body.toString('utf8')).entries;

  fs.appendFile(DATA_JSON_PATH, JSON.stringify(items) + '\n', (err) => {
    if (err) {
      console.log('Error writing event to file', err);
    }
  });

  res.sendStatus(200);
});

async function loadData() {
  const file = await fs.promises.readFile(DATA_JSON_PATH);

  // Split data into lines
  const lines = file.toString('utf8').split('\n');
  // Parse items
  const items = lines
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (err) {
        return [];
      }
    })
    .reduce((acc, parsedLine) => acc.concat(parsedLine), [])
    .reduce((acc, item) => item.i ? acc.concat(item.i) : acc.concat(item), []);

  /** @type Map<string, { events: Map<string, { eventTypeId: string, value?: number }>, treatment?: string }> */
  const groupedById = items.reduce((/** @type Map */ map, item) => {

    // 2 types of items: impressions and events
    if (item.k) {
      // impression
      const id = item.k;
      if (!map.has(id)) map.set(id, { events: new Map() });
      map.get(id).treatment = item.t;
    } else {
      // event
      const id = item.key;
      if (!map.has(id)) map.set(id, { events: new Map() });
      map.get(id).events.set(item.eventTypeId, item);
    }

    return map;
  }, new Map());

  const groupedByEventTypeId = Array.from(groupedById.values()).reduce((groups, item) => {
    item.events.forEach((event, eventTypeId) => {
      if (!groups[eventTypeId]) {
        groups[eventTypeId] = { on: [], off: [] };
      };
      const group = groups[eventTypeId];

      if (group[item.treatment]) group[item.treatment].push(event.value);
    });
    return groups;
  }, {});

  return groupedByEventTypeId;
}

dataRouter.get('/results', async (req, res) => {
  try {
    const groupedByEventTypeId = await loadData();

    /**
     * @type { { [eventTypeId: string]: { on: number, off: number, difference: number, relativeDifference: number } } }
     */
    const results = Object.keys(groupedByEventTypeId).reduce((results, eventTypeId) => {
      const valuesForOn = groupedByEventTypeId[eventTypeId].on;
      const valuesForOff = groupedByEventTypeId[eventTypeId].off;

      const meanON = valuesForOn.reduce((acc, value) => acc + value, 0) / valuesForOn.length;
      const meanOFF = valuesForOff.reduce((acc, value) => acc + value, 0) / valuesForOff.length;
      const stat = ttest(valuesForOn, valuesForOff, { alpha: 0.05, alternative: "less" });

      results[eventTypeId] = {
        sampleSizeON: valuesForOn.length,
        sampleSizeOFF: valuesForOff.length,
        meanON,
        meanOFF,
        pValue: stat.pValue,
        testDecision: `${meanON < meanOFF} (${stat.rejected})`, // null hypothesis (meanON >= meanOFF) is rejected if pValue < alpha
      };

      return results;
    }, {});

    // HTML table with results
    const html = Object.keys(results).reduce((html, eventTypeId) => {
      const result = results[eventTypeId];
      return html + `<tr><td>${eventTypeId}</td><td>${result.sampleSizeON}</td><td>${result.sampleSizeOFF}</td><td>${result.meanON}</td><td>${result.meanON}</td><td>${result.pValue}</td><td>${result.testDecision}</td></tr>`;
    }, '<table><tr><th>Event Type Id</th><th>Sample size ON</th><th>Sample size OFF</th><th>Mean ON</th><th>Mean OFF</th><th>P-value of one-tailed t-test</th><th>Mean ON < Mean OFF (P-value < 0.05)</th></tr>');
    res.send('<html><body>' + html + '</body></html>');

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = dataRouter;
