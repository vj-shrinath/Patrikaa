
"use client";

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create audio element on client
    if (!audioRef.current) {
      audioRef.current = new Audio("https://cdn.pixabay.com/audio/2025/09/29/audio_e0f45d586b.mp3");
      audioRef.current.loop = true;
    }

    // Attempt to autoplay
    const attemptAutoplay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay was prevented. User interaction is required to play music.");
        setIsPlaying(false);
      }
    };

    // Delay autoplay attempt slightly to improve chances of success
    const timer = setTimeout(attemptAutoplay, 100);

    const audioEl = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audioEl?.addEventListener('play', handlePlay);
    audioEl?.addEventListener('pause', handlePause);
    
    return () => {
      clearTimeout(timer);
      audioEl?.pause();
      audioEl?.removeEventListener('play', handlePlay);
      audioEl?.removeEventListener('pause', handlePause);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleMusic}
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg bg-primary/80 text-primary-foreground hover:bg-primary"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>
    </div>
  );
}
