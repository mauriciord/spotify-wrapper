import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonStubPromise from 'sinon-stub-promise';
chai.use(sinonChai);
sinonStubPromise(sinon);

global.fetch = require('node-fetch');

import { search, searchAlbums, searchArtists, searchPlaylists, searchTracks } from '../src/main';

describe('Spotify Wrapper', () => {

  describe('smoke tests', () => {

    it('should exist the search method', () => {
      expect(search).to.exist;
    });

    it('should exist the searchAlbums method', () => {
      expect(searchAlbums).to.exist;
    });

    it('should exist the searchArtists method', () => {
      expect(searchArtists).to.exist;
    });

    it('should exist the searchTracks method', () => {
      expect(searchTracks).to.exist;
    });

    it('should exist the searchPlaylists method', () => {
      expect(searchPlaylists).to.exist;
    });

  });

  describe('Generic Search', () => {
    let fetchedStub;
    let promise;

    beforeEach(() => {
      fetchedStub = sinon.stub(global, 'fetch');
      fetchedStub.returnsPromise();
    });

    afterEach(() => {
      fetchedStub.restore();
    });

    it('should call fetch function', () => {
      const artists = search();

      expect(fetchedStub).to.have.been.calledOnce;
    });

    it('should call fetch with the correct url', () => {
      context('passing one type', () => {
        const artists = search('Audioslave', 'artist');
        expect(fetchedStub)
          .to.have.been.calledWith('https://api.spotify.com/v1/search?q=Audioslave&type=artist');

        const albums = search('Audioslave', 'album');
        expect(fetchedStub).to.have.been
          .calledWith('https://api.spotify.com/v1/search?q=Audioslave&type=album');
      });

      context('passing more than one type', () => {
        const artistsAndAlbums = search('Audioslave', ['artist', 'album']);
        expect(fetchedStub).to.have.been
          .calledWith('https://api.spotify.com/v1/search?q=Audioslave&type=artist,album');
      });

    });

    it('should return the json data from the promise', () => {
      promise.resolves({ body: 'json' });
      const artists = search('Audioslave', 'artist');

      expect(artists.resolveValue).to.be.eql({ body: 'json' });
    });
  });
});
