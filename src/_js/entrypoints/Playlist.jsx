import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { audioType } from "../utils/audio.js";
import { hydrateFn } from "../utils/hydrate.js";


export default function Playlist(props) {
  const [jsEnabled, setJsEnabled] = useState(false);

  const [songIndex, setSongIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentSong = songIndex == null ? null : props.songs[songIndex];

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  useEffect(() => {
    if (audioRef.current == null) {
      // audioRef is not yet mounted
      return;
    }

    if (playing) {
      // if a song is currently playing, pause it and play the new song
      // no need to update the playing state, because it is already set to true
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
      return;
    }

    // if no song is currently playing, load and play the new song
    audioRef.current.load();
    setPlaying(true);
  }, [songIndex])

  useEffect(() => {
    if (audioRef.current == null) {
      // audioRef is not yet mounted
      return;
    }

    if (playing) {
      audioRef.current.play();
      return;
    }

    audioRef.current.pause();
  }, [playing])

  return <>
    <h3 className="pt-0 pt-sm-3 pb-1 pb-sm-2 mb-3 mb-sm-4">tracklist</h3>

    {jsEnabled && createPortal(
      <div className="position-fixed bottom-0 w-100 d-flex justify-content-center pb-2">
        <audio
          className="playlist-audio"
          controls
          preload="auto"
          ref={audioRef}
          style={{ maxHeight: "35px" }}
          onEnded={() => songIndex < props.songs.length - 1 && setSongIndex(songIndex + 1)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {currentSong && currentSong.files.map((file) => (
            <source key={file} src={`/assets/media/${file}`} type={audioType(file)} />
          ))}
        </audio>
      </div>,
      document.body
    )}

    {props.songs.map((song, index) => (
      <div
        key={song.title}
        className={`
          row align-items-center border-bottom border-white
          ${jsEnabled ? "hover:bg-translucent-light hover:text-very-muted" : ""}
          ${index == songIndex && jsEnabled ? "bg-translucent-light text-very-muted" : ""}
        `}
      >
        <div className="col-auto">
          <small>{index + 1}</small>
        </div>
        <div className="col">
          {jsEnabled
            ? (
              <PlayButton
                className={`
                  btn btn-sm btn-link p-0 text-inherit text-decoration-none
                  d-flex justify-content-start w-100 py-3
                `}
                content={() => <span className="lead">{song.title}</span>}
                index={index}
                playing={playing}
                songIndex={songIndex}
                setPlaying={setPlaying}
                setSongIndex={setSongIndex}
              />
            )
            : <div className="lead py-3">{song.title}</div>
          }
        </div>
        {song.files && <>
          {jsEnabled
            ? (
              <div className="col-auto">
                <PlayButton
                  className="btn btn-sm btn-link p-0 text-inherit text-decoration-none"
                  content={(action) => <i className={`bi bi-${action}-fill lead`}></i>}
                  index={index}
                  playing={playing}
                  songIndex={songIndex}
                  setPlaying={setPlaying}
                  setSongIndex={setSongIndex}
                />
              </div>
            )
            : (
              <div className="col-12 pt-2 pt-md-0 col-md-auto d-flex align-items-center">
                <noscript>
                  <audio controls preload="metadata" style={{ maxHeight: "35px" }}>
                    {song.files.map((file) => (
                      <source key={file} src={`/assets/media/${file}`} type={audioType(file)} />
                    ))}
                  </audio>
                </noscript>
              </div>
            )}
        </>}
      </div>
    ))}
  </>;
}

function PlayButton(props) {
  const action = props.playing && props.index == props.songIndex ? "pause" : "play"
  const isLoaded = props.index == props.songIndex
  return (
    <button
      className={props.className}
      onClick={() => (
        isLoaded
          ? props.setPlaying(!props.playing)
          : props.setSongIndex(props.index)
      )}
      aria-label={action}
    >
      {props.content(action)}
    </button>
  )
}

export const hydrate = hydrateFn(Playlist);
