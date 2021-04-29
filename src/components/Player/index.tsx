
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import  Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'



export default function Player () {
    const [progress, setProgress] = useState(0)

    const audioRef = useRef<HTMLAudioElement>(null) 
    const {
         episodeList,
         currentEpisodeIndex,
         isPlaing,
         temProximo,
         temAterior,
         isLooping,
         isShuffling,
         setOnPlay,
         togglePlay,
         playNext,
         playBack,
         toggleLoop,
         toggleShuffle
        } =  usePlayer()

    const episode = episodeList[currentEpisodeIndex]
  
    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if(isPlaing) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }

    }, [isPlaing])


    function setupProgressListenner(){
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleUpdate(amount:number) {
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>


            {!episode  && (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcastr para ouvir</strong>
                </div>
            )}

            {episode &&  (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        objectFit="cover"
                        src={episode.thumbnail}
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            )}


            <footer className={!episode &&  styles.empty}>
                <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress)}</span>         
                    {episode &&  (
                        <Slider 
                            max={episode.duration}
                            value={progress}
                            onChange={handleUpdate}
                            trackStyle={{ backgroundColor: '#04d361'}}
                            railStyle={{ backgroundColor:'#9f75ff' }}
                            handleStyle={{ borderColor: '#04d361' }}
                        />
                    )}
                    {!episode &&  (
                        <div className={styles.slider}>
                          <div className={styles.emptySlider} />
                      </div>
                    )}                  
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>                    
                </div>

                <div className={styles.buttons}>
                    <button 
                        type="button"
                        className={isShuffling && styles.isActive} 
                        onClick={() => toggleShuffle()}
                        disabled={!episode || episodeList.length === 1}
                        >
                           <img src="/shuffle.svg" alt="Embaralhar"/>    
                    </button>   
                    <button onClick={() => playBack()} type="button" disabled={!episode || !temAterior}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />    
                    </button> 
                    {
                        isPlaing ? (
                            <button onClick={() => togglePlay()}  type="button" className={styles.playButton } disabled={!episode}>
                              <img src="/pause.svg" alt="Pausar"/>    
                             </button>   
                        ) : (
                            <button onClick={() => togglePlay()} type="button" className={styles.playButton } disabled={!episode}>
                                <img src="/play.svg" alt="Tocar"/>    
                            </button>   
                        )               
                    }
                    <button onClick={() => playNext()} type="button" disabled={!episode || !temProximo}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>    
                    </button>     
                    <button className={isLooping && styles.isActive} type="button" onClick={() => toggleLoop()} disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir"/>    
                    </button>     
                </div>
            </footer>
        
        {episode && (
            <audio
              ref={audioRef}
              src={episode.url}
              autoPlay
              loop={isLooping}
              onLoadedMetadata={setupProgressListenner}
              onPlay={() => setOnPlay(true)}
              onPause={() => setOnPlay(false)}
            />
        )}
        </div>
    )
}