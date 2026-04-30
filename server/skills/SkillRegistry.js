// SkillRegistry.js

// This is the central skill registration and discovery system for Top1-Quantum-AI.

class SkillRegistry {
    constructor() {
        this.skills = {};
    }

    registerSkill(name, skill) {
        if (this.skills[name]) {
            throw new Error(`Skill with name ${name} is already registered.`);
        }
        this.skills[name] = skill;
    }

    getSkill(name) {
        return this.skills[name] || null;
    }

    listSkills() {
        return Object.keys(this.skills);
    }
}

module.exports = SkillRegistry;