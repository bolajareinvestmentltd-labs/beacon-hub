import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeArticleSlug, slugToArticleTitle } from './metadata';

describe('article metadata helpers', () => {
  it('normalizes URL-safe slugs consistently', () => {
    assert.equal(
      normalizeArticleSlug('Airdrop%20Scam%20Warning%20Cryptocurrency%20Investors'),
      'airdrop-scam-warning-cryptocurrency-investors'
    );
    assert.equal(
      normalizeArticleSlug('  Airdrop_Scam__Warning  '),
      'airdrop-scam-warning'
    );
  });

  it('derives a readable title from a slug when article metadata is unavailable', () => {
    assert.equal(
      slugToArticleTitle('airdrop-scam-warning-cryptocurrency-investors'),
      'Airdrop Scam Warning Cryptocurrency Investors'
    );
    assert.equal(slugToArticleTitle('market-watch-2027'), 'Market Watch 2027');
  });
});
