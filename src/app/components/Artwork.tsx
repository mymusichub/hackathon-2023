"use client";

import { Image, ImagesResponse } from "openai/resources";
import { FormEventHandler, useState } from "react";
import {
  createArtwork,
  createAudienceAgeRange,
  createAudienceTopCountries,
  createPromoText,
  createSocialText,
} from "../actions";
import styles from "./chat.module.css";

export interface Track {
  artist?: string;
  title?: string;
  genre?: string;
  subgenre?: string;
  moods?: string;
  advancedMoods?: string;
  keywords?: string;
  description?: string;
}

const empty: Track = {
  artist: "",
  title: "",
  genre: "",
  subgenre: "",
  moods: "",
  advancedMoods: "",
  keywords: "",
  description: "",
};

const mockTracks = [
  {
    artist: "Maude Latour",
    title: "Headphones",
    genre: "Pop",
    subgenre: "Electro, Synth Pop",
    moods: "Uplifting, Energetic, Happy",
    advancedMoods: "Bright, Feel Good, Optimistic, Positive",
    keywords:
      "Uplifting, Pop, Happy, Positive, Sexy, Energetic, Electro, Optimistic, Upbeat, Synth pop, Motivating, Fashion, Electronic, Chilled, Gladness, Lifestyle, Party, Motivational, Motivation, Floating",
    description:
      "Catchy and lively. Male singer electric guitar synth and rhythm.",
  },
  {
    artist: "347aidan",
    title: "Bad Kids",
    genre: "Hip Hop",
    subgenre: "Rap",
    moods: "Chilled, Uplifting",
    advancedMoods: "Confident, Euphoric, Motivational, Upbeat",
    keywords:
      "Chilled, Chillout, Easy, Pop, Positive, Relaxed, Floating, Happy, Smooth, Uplifting, Soulful, Laid back, Feeling, Optimistic, Emotion, Tender, Touching, Romantic, Soft",
    description:
      "Confident and cool pop with contemporary male vocals and retro synths.",
  },
  {
    artist: "Tinashe",
    title: "Naturally",
    genre: "Funk Soul",
    subgenre: "Neo Soul",
    moods: "Uplifting, Chilled",
    advancedMoods: "Cool, Seductive, Laid Back, Relaxed",
    keywords:
      "Pop, Chilled, Uplifting, Floating, Easy, Chillout, Positive, Soulful, Optimistic, Smooth, Happy, Feeling, Relaxed, Emotion, Touching, Upbeat, Laid back, Motivating, Airy",
    description:
      "Electro future beat. Confident and catchy. Sampled female voice synth and rhythm.",
  },
  {
    artist: "The Knocks, Dragonette",
    title: "Slow Song",
    genre: "Electronic Dance",
    subgenre: "Synth Pop",
    moods: "Happy, Uplifting",
    advancedMoods: "Feel Good, Bright, Upbeat, Fun",
    keywords:
      "Happy, Positive, Uplifting, Pop, Optimistic, Disco, Upbeat, Gladness, Chilled, Synth pop, Motivating, Energetic, Lucky, Delight, Joy, Rejoice, Fortunate, Prosperous, Easy, Electro",
    description:
      "Catchy and positive. Funky electric guitars and synths over punchy electro pop drums and a catchy chorus with female voice..",
  },
  {
    artist: "RealestK",
    title: "Love Me",
    genre: "Funk",
    subgenre: "RnB",
    moods: "Chilled",
    advancedMoods: "Relaxed, Laid Back, Seductive, Dreamy",
    keywords:
      "Chilled, Calm, Chillout, Floating, Smooth, Relaxed, Romantic, Tender, Easy, Moderate, Soft, Feeling, Touching, Emotion, Soulful, Love, Laid back, Romance, Gentle, Sentimental",
    description:
      "Smooth and sultry female vocals with chilled rhythms and synths.",
  },
  {
    artist: "Stefflon Don",
    title: "Like That",
    genre: "Rap",
    subgenre: "Trap",
    moods: "Chilled",
    advancedMoods: "Confident, Motivational, Inspirational, Anthemic",
    keywords:
      "Chilled, Hip hop, Trap, Chillout, Floating, Smooth, Calm, Relaxed, Easy, Laid back, Feeling, Touching, Soulful, Emotion, Sexy, Moderate, Tender, Soft, Dreamy, Chill out",
    description:
      "Aleks james and marsel is bring the heat in this medium tempo futuristic vibe. Resonant rhodes keys basketball references inspirational enamored synths that will grab your attention.",
  },
  {
    artist: "Teezo Touchdown",
    title: "Handyman",
    genre: "Latin",
    subgenre: "Pop",
    moods: "Chilled, Calm, Romantic, Ethereal",
    advancedMoods: "Emotional, Solemn, Thoughtful, Spiritual",
    keywords:
      "Chilled, Calm, Chillout, Floating, Smooth, Romantic, Tender, Relaxed, Easy, Soft, Moderate, Feeling, Touching, Emotion, Love, Soulful, Romance, Gentle, Laid back, Sentimental",
    description:
      "A mid tempo hummable indie pop anthem with cool synths and a contemporary groove. Uplifting with a strong and positive melody. It drops down in intensity on the.",
  },
  {
    artist: "Nilüfer Yanya",
    title: "anotherlife",
    genre: "Pop",
    subgenre: "",
    moods: "Happy, Chilled",
    advancedMoods: "Laid Back, Seductive, Sexy, Relaxed",
    keywords:
      "Happy, Pop, Chilled, Positive, Easy, Chillout, Optimistic, Floating, Gladness, Romantic, Relaxed, Feeling, Soulful, Lucky, Uplifting, Delight, Rejoice, Fortunate, Prosperous, Smooth",
    description: "Nostalgic and urban. Male singer synth and rhythm.",
  },
  {
    artist: "mwami",
    title: "danser",
    genre: "Electronic Dance",
    subgenre: "House",
    moods: "Dark, Ethereal, Sad",
    advancedMoods: "Confident, Determined, Ponderous, Cool",
    keywords:
      "House, Floating, Dark, Deep house, Ambient, Electronic, Sinister, Scary, Ethereal, Gloomy, Sci fi, Dreamy, Chilled, Hypnotic, Chillout, Ominous, Sphere, Synthesize, Ethereal, Mystical",
    description: "Dark and moody. Male singer electronics and rhythm.",
  },
  {
    artist: "whoismaiou",
    title: "Wisdom inside me",
    genre: "Soul",
    subgenre: "",
    moods: "Self acceptance, Perception, Introspection, Balance",
    advancedMoods: "",
    description:
      "an emotive journey exploring the clash between outward appearances and inner struggles. Through poignant melodies and introspective lyrics, whoismaiou delves into the tension between societal expectations and the acceptance of self and search for balance. Her music encapsulates the challenge of confronting haunting thoughts while seeking assurance and insight.",
  },
];

const ArtworkGenerator = () => {
  const [track, setTrack] = useState<Track>(empty);

  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false);
  const [isLoadingAgeAndCountry, setIsLoadingAgeAndCountry] = useState(false);
  const [isLoadingPromoText, setIsLoadingPromoText] = useState(false);
  const [isLoadingSocialText, setIsLoadingSocialText] = useState(false);

  const [artworkImages, setArtworkImages] = useState<Image[]>([]);
  const [ageRange, setAgeRange] = useState();
  const [topCountries, setTopCountries] = useState([]);
  const [promoText, setPromoText] = useState("");
  const [socialText, setSocialText] = useState("");

  const generateArtworks = async () => {
    setIsLoadingArtworks(true);
    try {
      const artworks = await createArtwork(track);
      setArtworkImages(artworks);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingArtworks(false);
    }
  };

  const generateAgeGroup = async () => {
    setIsLoadingAgeAndCountry(true);
    try {
      const ageRange = await createAudienceAgeRange(track);
      const topCountries = await createAudienceTopCountries(track);
      console.log(ageRange, topCountries);
      setAgeRange(JSON.parse(ageRange as string));
      setTopCountries(JSON.parse(topCountries as string).topCountries);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAgeAndCountry(false);
    }
  };

  const generatePromoText = async () => {
    setIsLoadingPromoText(true);
    try {
      const promoText = await createPromoText(track);
      setPromoText(promoText as string);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPromoText(false);
    }
  };

  const generateSocialText = async () => {
    setIsLoadingSocialText(true);
    try {
      const socialText = await createSocialText(track);
      setSocialText(socialText as string);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSocialText(false);
    }
  };

  const clear = () => {
    setTrack(empty);
    setArtworkImages([]);
    setAgeRange(undefined);
    setTopCountries([]);
    setPromoText("");
    setSocialText("");
  };

  console.log(topCountries, ageRange);

  return (
    <div>
      Sample Songs For Demo
      <div style={{ display: "flex", gap: 8 }}>
        {mockTracks.map((track, key) => {
          return (
            <button
              key={key}
              onClick={() => {
                clear();
                setTrack(mockTracks[key]);
              }}
            >
              {track.title}
              {track.title === "Wisdom inside me" ? " 💜" : ""}
            </button>
          );
        })}
      </div>
      <br></br>
      <button style={{ marginBottom: 16 }} onClick={clear}>
        Clear
      </button>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 36,
        }}
      >
        <span>Title</span>
        <input
          value={track.title}
          className={styles.chatInput}
          placeholder="Title"
          onChange={(e) => setTrack({ ...track, title: e.currentTarget.value })}
        />
        <span>Genre</span>
        <input
          value={track.genre}
          className={styles.chatInput}
          placeholder="Genres"
          onChange={(e) => setTrack({ ...track, genre: e.currentTarget.value })}
        />
        <span>Moods</span>
        <input
          value={track.moods}
          className={styles.chatInput}
          placeholder="Moods"
          onChange={(e) => setTrack({ ...track, moods: e.currentTarget.value })}
        />
        <span>Description</span>
        <input
          value={track.description}
          className={styles.chatInput}
          placeholder="Description"
          onChange={(e) =>
            setTrack({ ...track, description: e.currentTarget.value })
          }
        />
        <span>Artist</span>
        <input
          value={track.artist}
          className={styles.chatInput}
          placeholder="Artist"
          onChange={(e) =>
            setTrack({ ...track, artist: e.currentTarget.value })
          }
        />
      </form>
      {/* Artwork */}
      <div className={styles.mb4}>
        <h1>Artworks</h1>
        <button
          onClick={generateArtworks}
          style={{ marginBottom: 16, marginTop: 16 }}
        >
          Generate Artworks
        </button>
        <div>
          {isLoadingArtworks ? (
            "Loading..."
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              {artworkImages.map((image, key) => {
                return (
                  <div
                    key={key}
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <img width={200} height={200} src={image.url} />
                    <input value={key} type="radio" name="artwork" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Audience */}
      <div className={styles.mb4}>
        <h1>Potential Target Audience Demographics</h1>
        <button onClick={generateAgeGroup}>Generate Audience Data</button>
        <div style={{ fontSize: 24 }}>
          {isLoadingAgeAndCountry ? (
            <div>Loading...</div>
          ) : (
            <div>
              <h4>Age Demographics</h4>
              <ul className={styles.mb4}>
                {ageRange &&
                  Object.keys(ageRange as any).map((range, key) => {
                    return (
                      <li key={key}>
                        {range} ----- {ageRange?.[range]}%
                      </li>
                    );
                  })}
              </ul>
              <h4>Top Countries</h4>
              <ul>
                {topCountries?.map((country, key) => {
                  return <li key={key}>{country}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Promo */}
      <div className={styles.mb4}>
        <h1>Promo Text</h1>
        <button onClick={generatePromoText}>Generate promo text</button>
        <div style={{ fontSize: 24, fontWeight: 500 }}>
          {isLoadingPromoText ? "Loading..." : promoText}
        </div>
      </div>
      {/* Social Media */}
      <div className={styles.mb4}>
        <h1>Social Media Text</h1>
        <button onClick={generateSocialText}>Generate social media text</button>
        <div style={{ fontSize: 24, fontWeight: 500 }}>
          {isLoadingSocialText ? "Loading..." : socialText}
        </div>
      </div>
    </div>
  );
};

export default ArtworkGenerator;
