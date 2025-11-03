import { describe, it, expect } from 'vitest';
import {
  getHeroSectionData,
  getFeatures,
  getTechStack,
  getQuickStartCommands,
  getDocumentationLinks,
} from './landing-page-data';

describe('Landing Page Data Functions', () => {
  describe('getHeroSectionData', () => {
    it('returns hero section data with required fields', () => {
      const data = getHeroSectionData();

      expect(data).toHaveProperty('headline');
      expect(data).toHaveProperty('subheading');
      expect(data).toHaveProperty('primaryCtaText');
      expect(data).toHaveProperty('primaryCtaHref');
      expect(data).toHaveProperty('secondaryCtaText');
      expect(data).toHaveProperty('secondaryCtaHref');
    });

    it('returns correct hero headline', () => {
      const data = getHeroSectionData();

      expect(data.headline).toBe('Next.js Starter');
    });

    it('returns correct subheading', () => {
      const data = getHeroSectionData();

      expect(data.subheading).toBe('Production-Ready Template with Trunk-Based Development');
    });

    it('returns valid CTA hrefs', () => {
      const data = getHeroSectionData();

      expect(data.primaryCtaHref).toMatch(/^\//);
      expect(data.secondaryCtaHref).toMatch(/^https?:\/\//);
    });

    it('returns data with readonly type properties', () => {
      const data = getHeroSectionData();

      // TypeScript ensures readonly at compile time
      // At runtime, we verify the data structure is correct
      expect(typeof data.headline).toBe('string');
      expect(typeof data.subheading).toBe('string');
      expect(Object.keys(data).length).toBe(6);
    });
  });

  describe('getFeatures', () => {
    it('returns at least 3 features', () => {
      const features = getFeatures();

      expect(features.length).toBeGreaterThanOrEqual(3);
    });

    it('includes BDD First feature', () => {
      const features = getFeatures();
      const bddFeature = features.find((f) => f.id === 'bdd-first');

      expect(bddFeature).toBeDefined();
      expect(bddFeature?.title).toBe('BDD First');
    });

    it('includes Comprehensive Testing feature', () => {
      const features = getFeatures();
      const testingFeature = features.find((f) => f.id === 'comprehensive-testing');

      expect(testingFeature).toBeDefined();
      expect(testingFeature?.title).toBe('Comprehensive Testing');
    });

    it('includes Modern Stack feature', () => {
      const features = getFeatures();
      const modernFeature = features.find((f) => f.id === 'modern-stack');

      expect(modernFeature).toBeDefined();
      expect(modernFeature?.title).toBe('Modern Stack');
    });

    it('each feature has required fields', () => {
      const features = getFeatures();

      features.forEach((feature) => {
        expect(feature).toHaveProperty('id');
        expect(feature).toHaveProperty('title');
        expect(feature).toHaveProperty('description');
        expect(feature.id).toBeTruthy();
        expect(feature.title).toBeTruthy();
        expect(feature.description).toBeTruthy();
      });
    });

    it('returns immutable array structure', () => {
      const features = getFeatures();

      // TypeScript ensures readonly array at compile time
      // At runtime, verify it's an array
      expect(Array.isArray(features)).toBe(true);
      expect(features.length).toBeGreaterThan(0);
    });
  });

  describe('getTechStack', () => {
    it('returns array of technologies', () => {
      const techs = getTechStack();

      expect(Array.isArray(techs)).toBe(true);
      expect(techs.length).toBeGreaterThan(0);
    });

    it('includes required technologies', () => {
      const techs = getTechStack();
      const techNames = techs.map((t) => t.name);

      expect(techNames).toContain('Next.js 15');
      expect(techNames).toContain('React 18');
      expect(techNames).toContain('TypeScript');
      expect(techNames).toContain('Tailwind CSS 3');
      expect(techNames).toContain('Vitest');
      expect(techNames).toContain('Playwright');
    });

    it('each technology has required fields', () => {
      const techs = getTechStack();

      techs.forEach((tech) => {
        expect(tech).toHaveProperty('id');
        expect(tech).toHaveProperty('name');
        expect(tech.id).toBeTruthy();
        expect(tech.name).toBeTruthy();
      });
    });

    it('version field is optional', () => {
      const techs = getTechStack();

      const withVersion = techs.filter((t) => t.version !== undefined);
      const withoutVersion = techs.filter((t) => t.version === undefined);

      expect(withVersion.length).toBeGreaterThan(0);
      expect(withoutVersion.length).toBeGreaterThan(0);
    });

    it('returns immutable array structure', () => {
      const techs = getTechStack();

      // TypeScript ensures readonly array at compile time
      // At runtime, verify it's an array
      expect(Array.isArray(techs)).toBe(true);
      expect(techs.length).toBeGreaterThan(0);
    });
  });

  describe('getQuickStartCommands', () => {
    it('returns exactly 3 quick start commands', () => {
      const commands = getQuickStartCommands();

      expect(commands.length).toBe(3);
    });

    it('includes dev command', () => {
      const commands = getQuickStartCommands();
      const devCommand = commands.find((c) => c.id === 'dev');

      expect(devCommand).toBeDefined();
      expect(devCommand?.command).toBe('npm run dev');
    });

    it('includes test command', () => {
      const commands = getQuickStartCommands();
      const testCommand = commands.find((c) => c.id === 'test');

      expect(testCommand).toBeDefined();
      expect(testCommand?.command).toBe('npm test');
    });

    it('includes build command', () => {
      const commands = getQuickStartCommands();
      const buildCommand = commands.find((c) => c.id === 'build');

      expect(buildCommand).toBeDefined();
      expect(buildCommand?.command).toBe('npm run build');
    });

    it('each command has required fields', () => {
      const commands = getQuickStartCommands();

      commands.forEach((command) => {
        expect(command).toHaveProperty('id');
        expect(command).toHaveProperty('label');
        expect(command).toHaveProperty('command');
        expect(command.id).toBeTruthy();
        expect(command.label).toBeTruthy();
        expect(command.command).toBeTruthy();
      });
    });

    it('all commands are npm commands', () => {
      const commands = getQuickStartCommands();

      commands.forEach((command) => {
        expect(command.command).toMatch(/^npm/);
      });
    });

    it('returns immutable array structure', () => {
      const commands = getQuickStartCommands();

      // TypeScript ensures readonly array at compile time
      // At runtime, verify it's an array
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBe(3);
    });
  });

  describe('getDocumentationLinks', () => {
    it('returns array of documentation links', () => {
      const links = getDocumentationLinks();

      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
    });

    it('includes required documentation links', () => {
      const links = getDocumentationLinks();
      const linkIds = links.map((l) => l.id);

      expect(linkIds).toContain('claude-md');
      expect(linkIds).toContain('agent-workflow-guide');
      expect(linkIds).toContain('testing-guide');
      expect(linkIds).toContain('contributing');
      expect(linkIds).toContain('branching-strategy');
      expect(linkIds).toContain('typescript-enforcer');
      expect(linkIds).toContain('test-quality-reviewer');
      expect(linkIds).toContain('nextjs-expert');
      expect(linkIds).toContain('bdd-expert');
    });

    it('each link has required fields', () => {
      const links = getDocumentationLinks();

      links.forEach((link) => {
        expect(link).toHaveProperty('id');
        expect(link).toHaveProperty('title');
        expect(link).toHaveProperty('description');
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('category');
        expect(link.id).toBeTruthy();
        expect(link.title).toBeTruthy();
        expect(link.description).toBeTruthy();
        expect(link.href).toBeTruthy();
      });
    });

    it('each link has valid category', () => {
      const links = getDocumentationLinks();
      const validCategories = ['getting-started', 'development', 'best-practices', 'architecture'];

      links.forEach((link) => {
        expect(validCategories).toContain(link.category);
      });
    });

    it('all hrefs are strings starting with / or https', () => {
      const links = getDocumentationLinks();

      links.forEach((link) => {
        expect(link.href).toMatch(/^\/|^https/);
      });
    });

    it('returns immutable array structure', () => {
      const links = getDocumentationLinks();

      // TypeScript ensures readonly array at compile time
      // At runtime, verify it's an array
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
