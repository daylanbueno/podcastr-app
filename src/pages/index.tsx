import { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { usePlayer } from '../contexts/PlayerContext'
import { useContext } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import { api } from '../services/api'

import styles from './home.module.scss'

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  durationAsString: string;
  thumbnail: string;
  duration:number;
  url: string; 
}

type HomeProps = {
  allEpisodes: Array<Episode>
  latesEpisodes: Array<Episode>
}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer() 
  const episodeList = [...latesEpisodes, ...allEpisodes];

  return (
    <div className={styles.homePage}>

      <section className={styles.latesEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {
             latesEpisodes.map((ep,index) => {
               return (
                 <li key={ep.id}>
                   <Image width={192} height={192} objectFit="cover" src={ep.thumbnail} alt={ep.title} />

                   <div className={styles.episodeDetails}>
                   <Link href={`/episodes/${ep.id}`}>
                      <a>{ep.title}</a>
                    </Link>
                      <p>{ep.members}</p>
                      <span>{ep.publishedAt}</span>
                      <span>{ep.durationAsString}</span>
                   </div>

                   <button  onClick={() => playList(episodeList, index)} type="button">
                     <img src="/play-green.svg" alt="Tocar episódio"/>
                   </button>
                 </li>
                 )
             })
          }
        </ul>
      </section>


      <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((item,index) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <Image 
                          width={120}
                          height={120}
                          src={item.thumbnail}
                          alt={item.title}
                          objectFit="cover"
                        />
                    </td>
                    <td>
                      <Link href={`/episodes/${item.id}`}>
                        <a>{item.title}</a>
                      </Link>
                    </td>
                      <td>{item.members}</td>
                      <td style={{ width: 100 }}>{item.publishedAt}</td>
                      <td>{item.durationAsString}</td>
                      <td>
                        <button onClick={() => playList(episodeList,index + latesEpisodes.length)} type="button">
                          <img src="/play-green.svg" alt="Tocar episódio"/>
                        </button>
                      </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>

    </div>
  )
}


export  const getStaticProps: GetStaticProps = async () =>  {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'publicshed_at_',
      _order: 'desc'
    }
  })

  const episodes = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      members: item.members,
      published_at: item.published_at,
      publishedAt: format(parseISO(item.published_at),'d MMM yy', { locale: ptBR }),
      duration:  Number(item.file.duration),
      durationAsString: convertDurationToTimeString(Number(item.file.duration)),
      description: item.description,
      url: item.file.url
    }
  })

  const latesEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return { 
    props: {
      latesEpisodes: latesEpisodes,
      allEpisodes: allEpisodes
    },
    revalidate: 60*60*8,
  }

}