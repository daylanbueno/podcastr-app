import { createContext, ReactNode, useState, useContext } from 'react'

type Episode  = {
    id: string;
    title: string;
    members: string;
    publishedAt: string;
    durationAsString: string;
    thumbnail: string;
    duration:number;
    url: string; 
}

type playContextDate = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaing: boolean;
    temProximo: boolean;
    temAterior:boolean;
    isLooping: boolean;
    isShuffling:boolean;
    play: (episode:Episode) => void;
    togglePlay:() => void;
    setOnPlay:(value: boolean) => void;
    playList:(list:Episode[], index:number) => void;
    playNext:() => void;
    playBack:() => void;
    playRepite:() => void;
    toggleLoop:() => void;    
    toggleShuffle:() => void;

}


type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as playContextDate)


export function PlayerContextProvider({ children } : PlayerContextProviderProps) {

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaing, setIsplaing] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffilin] = useState(false)

    const temAterior = currentEpisodeIndex > 0;
    const temProximo = currentEpisodeIndex + 1 < episodeList.length ;

  
    function play(episode: Episode) {
      setEpisodeList([episode])
      setCurrentEpisodeIndex(0)
      setIsplaing(true)
    }

    function playList(list:Episode[], index:number) {
      setEpisodeList(list)
      setCurrentEpisodeIndex(index)
      setIsplaing(true)
    }
  
    function togglePlay() {
      setIsplaing(!isPlaing)
    }
  
    function setOnPlay(value: boolean) {
      setIsplaing(value)
    }

    function playNext() {
      if (isShuffling) {
         const  indexRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
         setCurrentEpisodeIndex(indexRandomEpisodeIndex)
        return
      }
      if(temProximo){
        setCurrentEpisodeIndex(currentEpisodeIndex + 1)
      }
    }

    function playBack () {
      if(temAterior) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1)
      }
    }

    function playRepite() {
      setCurrentEpisodeIndex(currentEpisodeIndex)
    }

    function toggleLoop() {
      setIsLooping(!isLooping)
    }
    
    function toggleShuffle() {
      setIsShuffilin(!isShuffling)
    }

    return (
        <PlayerContext.Provider 
             value={{ 
               episodeList,
               currentEpisodeIndex,
               isPlaing,
               temProximo,
               temAterior,
               isLooping,
               isShuffling,
               playList,
               togglePlay,
               setOnPlay,
               playNext,
               playBack,
               playRepite,
               play,
               toggleLoop,
               toggleShuffle
             }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}