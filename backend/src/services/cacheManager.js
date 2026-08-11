const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '../../cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Gets the cache file path for a mission.
 * @param {string} missionId 
 * @returns {string}
 */
function getCachePath(missionId) {
  return path.join(CACHE_DIR, `mission-${missionId}.json`);
}

/**
 * Loads the cached agent outputs for a mission.
 * @param {string} missionId 
 * @returns {object}
 */
function getMissionCache(missionId) {
  const filePath = getCachePath(missionId);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`[CacheManager] Error reading cache file for ${missionId}:`, error);
    }
  }
  return {};
}

/**
 * Saves agent output to the mission's cache file.
 * @param {string} missionId 
 * @param {number|string} agentIndex 
 * @param {any} output 
 */
function saveAgentOutputToCache(missionId, agentIndex, output) {
  try {
    const cache = getMissionCache(missionId);
    cache[agentIndex] = output;
    fs.writeFileSync(getCachePath(missionId), JSON.stringify(cache, null, 2), 'utf8');
    console.log(`[CacheManager] Saved output of Agent ${agentIndex} to cache for mission ${missionId}`);
  } catch (error) {
    console.error(`[CacheManager] Error writing cache file for ${missionId}:`, error);
  }
}

module.exports = {
  getMissionCache,
  saveAgentOutputToCache
};
