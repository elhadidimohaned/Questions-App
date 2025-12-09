const fs = require('fs');
const path = 'd:\\Questions App\\data.js';

try {
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');
    const map = [];

    let currentStart = -1;
    let currentId = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('{')) {
            currentStart = i + 1; // 1-indexed
        }
        if (line.includes('"id":')) {
            const match = line.match(/"id":\s*(\d+)/);
            if (match) currentId = parseInt(match[1]);
        }
        if (line.trim().startsWith('}') || line.trim().startsWith('},')) {
            if (currentStart !== -1 && currentId !== null) {
                map.push({ id: currentId, start: currentStart, end: i + 1 });
                currentStart = -1;
                currentId = null;
            }
        }
    }

    // Output summary and first 100 mapping items for review
    console.log(`Found ${map.length} questions.`);
    // Group by thousands to see density
    const groups = {};
    map.forEach(m => {
        const k = Math.floor(m.id / 1000) * 1000;
        groups[k] = (groups[k] || 0) + 1;
    });
    console.log("Distribution:", groups);

    // Save map to file for the agent to read if needed, or just partial output
    fs.writeFileSync('d:\\Questions App\\question_map.json', JSON.stringify(map, null, 2));

} catch (e) {
    console.error(e);
}
