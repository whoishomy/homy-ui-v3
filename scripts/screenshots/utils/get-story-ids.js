"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStoryIds = getAllStoryIds;
exports.getComponentStoryIds = getComponentStoryIds;
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
function sanitizeStoryId(id) {
    // Replace emoji and special characters with descriptive text
    return id
        .toLowerCase()
        .replace(/[^\w\s/-]/g, '') // Remove special characters but keep forward slashes
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
}
function getStoryIds() {
    const stories = [];
    
    // Use find command to locate story files
    const storyFiles = execSync('find src -name "*.stories.*"', { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .filter(Boolean);

    storyFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Extract the title from the meta object
        const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
        if (!titleMatch) return;
        
        const title = titleMatch[1];
        const sanitizedTitle = sanitizeStoryId(title);
        
        // Extract export names (story variants)
        const exportMatches = content.match(/export\s+const\s+(\w+):\s*Story/g);
        if (!exportMatches) return;
        
        const storyNames = exportMatches
            .map(match => match.replace(/export\s+const\s+/, '').replace(/:\s*Story.*$/, ''))
            .filter(name => name !== 'default' && name !== 'meta');
        
        // Create story IDs for each variant
        storyNames.forEach(storyName => {
            const storyId = `${sanitizedTitle}--${storyName.toLowerCase()}`;
            stories.push({
                storyId,
                componentName: title,
                storyTitle: title
            });
        });
    });

    return stories;
}
async function getAllStoryIds() {
    return getStoryIds();
}
async function getComponentStoryIds(componentName) {
    const allStories = await getAllStoryIds();
    const searchTerm = componentName.toLowerCase();
    
    return allStories.filter(story => {
        const storyTitleLower = story.storyTitle.toLowerCase();
        return storyTitleLower.includes(searchTerm) || 
               story.storyId.includes(searchTerm);
    });
}
// CLI support
if (require.main === module) {
    const args = process.argv.slice(2);
    const componentName = args[0];
    
    if (componentName) {
        getComponentStoryIds(componentName)
            .then(stories => console.log(JSON.stringify(stories, null, 2)))
            .catch(console.error);
    } else {
        getAllStoryIds()
            .then(stories => console.log(JSON.stringify(stories, null, 2)))
            .catch(console.error);
    }
}

module.exports = {
    getAllStoryIds,
    getComponentStoryIds
};
