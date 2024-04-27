import { useMutation, useQuery, useQueryClient } from 'react-query'
import './Winners.css'
import { deleteWinner, getWinners } from '../../api/api'
import { useEffect, useState } from 'react'
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import Loader from '../Loader/Loader'

interface IWinners {
  id: number
  name: string
  time: number
  color: string
  wins: number
}

export type IData = { time: number }

export default function Winners() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [carsPerPage, setCarsPerPage] = useState<number>(7)
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState<boolean>(false)

  const { data, isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: getWinners,
    staleTime: 5000,
  })

  const [currentCars, setCurrentCars] = useState<IWinners[]>([])
  const [arrowTime, setArrowTime] = useState<boolean>(false)
  const [arrowWins, setArrowWins] = useState<boolean>(false)

  useEffect(() => {
    const lastCarIndex = currentPage * carsPerPage
    const firstCarIndex = lastCarIndex - carsPerPage
    setCurrentCars(data?.slice(firstCarIndex, lastCarIndex) ?? [])
  }, [data, currentPage, carsPerPage])

  const removeWinnerMutation = useMutation({
    mutationFn: deleteWinner,
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('winners')
      setLoading(false)
    },
    onError: () => {
      setLoading(false)
    },
  })

  const removeWinner = (id: number) => {
    removeWinnerMutation.mutate(id)
  }

  // sort time
  const sortTimeFromAtoB = () => {
    const sorted = [...currentCars].sort(
      (a: IWinners, b: IWinners) => a.time - b.time,
    )
    setCurrentCars(sorted)
  }

  const sortTimeFromBtoA = () => {
    const sorted = [...currentCars].sort(
      (a: IWinners, b: IWinners) => b.time - a.time,
    )
    setCurrentCars(sorted)
  }

  // sort wins
  const sortWinsFromAtoB = () => {
    const sorted = [...currentCars].sort(
      (a: IWinners, b: IWinners) => a.wins - b.wins,
    )
    setCurrentCars(sorted)
  }

  const sortWinsFromBtoA = () => {
    const sorted = [...currentCars].sort(
      (a: IWinners, b: IWinners) => b.wins - a.wins,
    )
    setCurrentCars(sorted)
  }

  const arrowTimeToggle = () => {
    setArrowTime((prev) => !prev)
    arrowTime ? sortTimeFromAtoB() : sortTimeFromBtoA()
  }

  const arrowWinsToggle = () => {
    setArrowWins((prev) => !prev)
    arrowWins ? sortWinsFromAtoB() : sortWinsFromBtoA()
  }

  return (
    <>
      {loading || isLoading ? (
        <Loader />
      ) : (
        <div className="winners-container container">
          <h1 className="title">winners</h1>
          <table border={1}>
            <thead>
              <tr>
                <th>id</th>
                <th>car</th>
                <th>name</th>
                <th>
                  wins
                  <button onClick={arrowWinsToggle}>
                    {arrowWins ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                </th>
                <th>
                  best time (seconds)
                  <button onClick={arrowTimeToggle}>
                    {arrowTime ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                </th>
                <th style={{ borderColor: 'transparent' }}></th>
              </tr>
            </thead>
            <tbody>
              {currentCars.map(({ id, name, time, color, wins }: IWinners) => (
                <tr key={id}>
                  <td>#{id}</td>
                  <td className="car">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 100 125"
                      enableBackground="new 0 0 100 100"
                      xmlSpace="preserve"
                      fill={color}
                      width={150}
                      height={150}
                      style={{
                        rotate: '90deg',
                        filter: `drop-shadow(0 0 10px ${color})`,
                      }}
                    >
                      <path d="M49.6716042,4.151072c-1.6597977,0.0196633-3.3110008,0.2255411-4.9306374,0.5870605  c-1.617588,0.3610616-3.1905861,0.9052839-4.6997223,1.5878253c-1.5186424,0.6868386-2.9721985,1.5373087-4.3271904,2.5072446  c-0.6834373,0.4892197-1.3395386,1.0150871-1.9458961,1.597784c-0.5749855,0.5525513-1.1539993,1.1698389-1.484848,1.9052649  c-0.3419533,0.7601204-0.3767986,1.5856609-0.416029,2.405262c-0.0423794,0.8853922-0.0510387,1.7723207-0.070013,2.6584196  c-0.0384865,1.7973366-0.0405045,3.5961342-0.060318,5.3937836c-0.019371,1.7574291-0.0736427,3.519062,0.1017761,5.2709503  c0.0872574,0.8714161,0.263649,1.7304707,0.3628006,2.6003933c0.0987244,0.8661289,0.1158562,1.7320957,0.1179924,2.6028881  c0.0010986,0.4476128,0.0021782,0.8952217,0.003273,1.3428345c0.000267,0.1089325,0.0005112,0.217865,0.0007172,0.3267937  c0.0001106,0.0602646,0.0269737,0.2107849,0.0006371,0.2616692c-0.0228462,0.0441399-0.1323586,0.0828362-0.1766891,0.1080933  c-0.0947762,0.0539932-0.1887627,0.1092491-0.2815495,0.1665726c-0.3545113,0.2190132-0.7047253,0.4457664-1.0395737,0.6941605  c-0.3003845,0.2228279-0.6078835,0.4423256-0.8703079,0.7104912c-0.2382374,0.2434502-0.4072609,0.5109406-0.4978809,0.8391838  c-0.098381,0.3563499-0.1496372,0.7607956-0.1467552,1.1312447c0.0011177,0.1436996,0.0106201,0.3726006,0.1533241,0.4544563  c0.1498508,0.0859604,0.367178-0.0099335,0.509676-0.067318c0.3949738-0.1590614,0.7788219-0.3436584,1.1638699-0.5252113  c0.3898926-0.1838341,0.7788773-0.3695869,1.1683426-0.5543251c0.0120583,0.2713661-0.0178719,0.5523109-0.0276299,0.8244476  c-0.0105972,0.295639-0.021183,0.5912781-0.0317879,0.8869171c-0.0210228,0.5859337-0.0421181,1.1718636-0.0631523,1.7577972  c-0.0419655,1.1689529-0.0918694,2.3379135-0.1218071,3.5072327c-0.0602188,2.3522148-0.1190491,4.7039299-0.1541538,7.0566635  c-0.0344391,2.3080902-0.0738831,4.6194153-0.0284977,6.9276085c0.0459328,2.3360748,0.1344795,4.6741943,0.1342278,7.0107918  c-0.000061,0.5529251-0.0061684,1.1067886-0.040617,1.658783c-0.0354958,0.5687637-0.0958614,1.1353149-0.1521206,1.7022858  c-0.1118126,1.1268005-0.1596985,2.2479401-0.1916866,3.381897c-0.0328979,1.1661987-0.0303345,2.3350449-0.0205383,3.5015717  c0.0099945,1.1899414,0.0134697,2.3801041,0.0307026,3.5699615c0.0170994,1.1806641,0.0394363,2.3616257,0.0873871,3.5414963  c0.0233669,0.5749512,0.0540237,1.1564102,0.194437,1.7167969c0.1340542,0.534996,0.3668804,1.0372925,0.5970669,1.536171  c0.4946823,1.072113,1.0040207,2.1374207,1.4817657,3.2172546c0.2229156,0.5038452,0.4428253,1.0053406,0.6695976,1.5065689  c0.2092094,0.4624023,0.4167366,0.9399719,0.7827873,1.3028717c0.3644753,0.3613434,0.8167152,0.6193085,1.2624741,0.8661041  c0.4957466,0.2744827,1.0069427,0.5201035,1.5246124,0.7502289c1.0642662,0.4731064,2.1602325,0.868721,3.272686,1.2121582  c2.1931381,0.6770782,4.4939384,1.1564102,6.7904205,1.2564011c1.1852417,0.0515976,2.3719521,0.0517654,3.5569077-0.007843  c1.1679649-0.0587463,2.325737-0.2264938,3.4717789-0.4557877c2.2653084-0.4532318,4.4886971-1.130394,6.5972672-2.0781021  c0.5180664-0.2328491,1.0258598-0.4876938,1.5209808-0.7660599c0.4430237-0.2490768,0.9127007-0.5283051,1.238224-0.9272537  c0.3369141-0.4128952,0.5407181-0.9161148,0.7558746-1.3986588c0.2242126-0.5028839,0.4470291-1.00811,0.6716919-1.5129089  c0.4611588-1.036171,0.9536667-2.0581894,1.4271088-3.0887527c0.1990585-0.4332962,0.3959045-0.8710938,0.5187759-1.333168  c0.1326523-0.4988708,0.179306-1.0139465,0.2042847-1.528183c0.1138687-2.3438492,0.1071243-4.6938248,0.1268463-7.0397568  c0.0192719-2.2915878,0.0421066-4.6066284-0.1762161-6.884697c-0.109169-1.1390533-0.2197113-2.2697372-0.2257462-3.4152985  c-0.0062943-1.194664,0.0310898-2.3895264,0.0561676-3.5838203c0.0250626-1.1936493,0.0499344-2.3872986,0.0749207-3.5809479  c0.0248184-1.1860123,0.0122681-2.3730736,0.0137634-3.5593414c0.0029678-2.3441238-0.0433655-4.6913834-0.103302-7.0347023  c-0.0610199-2.3857384-0.1305771-4.7704849-0.2162933-7.155468c-0.0203476-0.5661812-0.0406952-1.1323662-0.0610428-1.6985474  c-0.0100861-0.2806129-0.0201874-0.5612259-0.0302582-0.8418388c-0.0052414-0.1458969-0.0104752-0.29179-0.0157166-0.4376869  c-0.0026169-0.0729485-0.0052414-0.1459007-0.0078659-0.218853c-0.0013809-0.0384064-0.0201416-0.1118393,0.0015335-0.1422043  c0.4173355,0.1979637,0.8341217,0.3970833,1.2520676,0.5937462c0.3839417,0.1806602,0.7662201,0.3690224,1.1643372,0.5168571  c0.1383591,0.0513763,0.346077,0.1209602,0.4664307-0.0043564c0.0955276-0.0994682,0.103302-0.2707939,0.1034241-0.3992844  c0.0003891-0.4069366-0.0450134-0.8380737-0.1642075-1.2278214c-0.2224274-0.7273216-0.9459915-1.1875954-1.5339508-1.605217  c-0.3501968-0.2487411-0.7116394-0.4821243-1.0838699-0.6965446c-0.049675-0.0286179-0.0995483-0.0568962-0.1492004-0.0855522  c-0.0610275-0.0352249-0.0771561-0.0404816-0.077034-0.1113586c0.000206-0.1182098,0.0004959-0.2364197,0.0007858-0.3546295  c0.0005569-0.2286072,0.0011215-0.4572144,0.0016785-0.6858177c0.002182-0.8948288-0.0204315-1.7952385,0.0469818-2.6882725  c0.0654373-0.866785,0.2218933-1.717514,0.3402176-2.5775433c0.2412567-1.7534733,0.2248001-3.5151215,0.2066116-5.2810841  c-0.0184402-1.7906246-0.0431976-3.5810986-0.069252-5.3716259c-0.0129852-0.8921185-0.0185852-1.7845268-0.0416565-2.6764593  c-0.0213242-0.8241558-0.0290756-1.678894-0.2166519-2.4857368c-0.1887131-0.8117266-0.6646576-1.4794769-1.2191086-2.0856705  c-0.5727615-0.6262178-1.2243195-1.1790209-1.8946838-1.6973629c-1.2986488-1.0041389-2.7322693-1.8703628-4.2040634-2.5948491  c-1.5101242-0.7433534-3.1000061-1.3311381-4.7306213-1.74822c-1.6299133-0.4169016-3.3178444-0.6760302-5.0001869-0.7286158  C50.4910316,4.1505036,50.0812569,4.146101,49.6716042,4.151072z M61.3282967,67.0172577  c-1.5547142,0.164856-3.1136131,0.2896347-4.674427,0.3795471c-1.4781456,0.085144-2.9580612,0.1389923-4.4384232,0.1645355  c-1.3444061,0.0231934-2.689209,0.0230331-4.0336266,0.0007172c-1.1799736-0.0195847-2.3596725-0.0562134-3.5385818-0.1100235  c-0.9616814-0.0438995-1.9228592-0.0991821-2.883152-0.1670151c-0.7068176-0.0499191-1.4131851-0.1065292-2.1187592-0.1717606  c-0.2454338-0.0226898-0.4907722-0.0464401-0.7359695-0.0715485c-0.0494347-0.0050583-0.0988617-0.0101776-0.1482811-0.015358  c-0.0155869-0.0016327-0.0475044,0.0012665-0.0609093-0.0064163c-0.037117-0.0212708-0.0246773-0.1112289-0.0270157-0.1614838  c-0.0187378-0.4033585-0.037468-0.8067093-0.0562019-1.2100601c-0.0732079-1.5762329-0.1464233-3.1524696-0.2196045-4.7287025  c-0.0732803-1.5783119-0.1465797-3.15662-0.219883-4.7349281c-0.0729446-1.5704651-0.131382-3.1422234-0.2456512-4.7103806  c-0.0278015-0.3815422-0.0594521-0.7627754-0.0910797-1.1440163c0.4153252-0.0320511,0.8301506-0.0783272,1.2454796-0.1124535  c1.1485405-0.0943718,2.2987022-0.1691628,3.4494705-0.23032c1.7202339-0.0914268,3.4421768-0.1511497,5.1645737-0.180912  c2.1393776-0.0369682,4.2796631-0.0274391,6.4185257,0.0331459c2.4120598,0.0683289,4.8226471,0.201622,7.226368,0.4144249  c0.0778618,0.0068932,0.8274269,0.0742416,0.8275681,0.0673141c-0.1770363,2.1763649-0.2671852,4.3562317-0.3685188,6.5371094  c-0.1010437,2.1745796-0.2019958,4.3491592-0.3030281,6.5237389C61.440876,64.5940247,61.3847694,65.8056488,61.3282967,67.0172577z   M60.3410988,82.7579651c-0.1423111,1.273468-0.3286858,2.553421-1.0582695,3.6402817  c-0.6927719,1.0320282-1.7335091,1.6773529-2.873085,2.1218185c-1.2402878,0.483757-2.5536766,0.7497559-3.8772621,0.8665543  c-1.3831024,0.1220551-2.7842293,0.1384277-4.1705475,0.0635452c-1.3477821-0.0727997-2.688839-0.2511673-3.9803467-0.6547775  c-1.1663361-0.3644943-2.3437653-0.8820343-3.1859283-1.7958145c-0.3993797-0.433342-0.7207298-0.9375839-0.9489746-1.4807129  c-0.2475471-0.5890656-0.3775635-1.2194366-0.4689407-1.8494568c-0.1982422-1.3668365-0.3066978-2.7487183-0.4213829-4.1245117  c-0.2299805-2.7589035-0.3546257-5.5277786-0.4831009-8.2928314c-0.0159416-0.3430786-0.0318832-0.6861572-0.0478096-1.0292358  c0.7421722,0.1300278,1.4878616,0.2401199,2.2349586,0.3376617c1.1781693,0.1538162,2.3606453,0.2746735,3.5452232,0.3666534  c1.521286,0.1181259,3.04636,0.1881866,4.5720711,0.2098007c1.7900658,0.0253601,3.5812798-0.0161133,5.3679161-0.1305542  c1.9700661-0.1261826,3.9349136-0.3411636,5.883625-0.6576538c0.2503548-0.040657,0.5004349-0.0830002,0.7502174-0.1270523  c-0.0755692,1.6271896-0.1367416,3.2557983-0.2386169,4.8815765c-0.1021156,1.6295624-0.192028,3.2601242-0.3307648,4.8870773  C60.5313148,80.9139786,60.443924,81.8366623,60.3410988,82.7579651z M62.807579,44.191494  c-0.0620079,0.5198326-0.1280022,1.0391998-0.1853867,1.5595779c-0.0275688,0.2500038-0.0540009,0.5001335-0.08144,0.7501488  c-0.0053711,0.0489273-0.0005226,0.2799721-0.0351448,0.3023758c-0.0206947,0.0133896-0.1096573-0.0105515-0.134819-0.0129738  c0.0451851,0,0.090374,0,0.1355591,0c-1.5933495-0.3548393-3.1839218-0.6756554-4.8052559-0.8752823  c-1.6346359-0.2012711-3.280571-0.3453941-4.9259071-0.4207191c-1.6503029-0.0755539-3.3050919-0.0818748-4.9560051-0.0224915  c-1.6548729,0.0595245-3.3101578,0.1891365-4.9553452,0.3766098c-1.6195335,0.1845512-3.2166748,0.4624214-4.8072319,0.8172455  c-0.1867867,0.0416679-0.3732529,0.0882912-0.5610619,0.1247559c-0.2332535-2.1124153-0.4968147-4.2212105-0.7422714-6.3322258  c-0.2465439-2.1203537-0.5568314-4.2344818-0.8407135-6.3501358c-0.1420631-1.0587616-0.2769394-2.117691-0.356945-3.1832943  c-0.0396919-0.5286884-0.0667534-1.0588398-0.0676765-1.5891247c-0.0002289-0.1319618,0.0017128-0.2639179,0.0053596-0.3958263  c0.0033455-0.1208572-0.0149689-0.2785988,0.0155029-0.3954964c0.0173912-0.066721,0.0232277-0.0604877,0.0905914-0.1057816  c0.052948-0.0356064,0.1059227-0.0711823,0.1589737-0.1066418c0.1060486-0.0708828,0.2123642-0.1413803,0.319313-0.2108994  c0.8576622-0.5574913,1.7754593-0.9987144,2.7168884-1.3953037c0.9609718-0.4048214,1.9356995-0.7808018,2.9248657-1.1112633  c2.0020561-0.6688519,4.0965385-1.0259743,6.1967812-1.202219c2.1167145-0.1776295,4.2280922-0.0624771,6.3266754,0.2533112  c1.0359726,0.1558914,2.0673409,0.3590164,3.0749435,0.6479683c1.0114517,0.2900543,2.0033379,0.6515312,2.9809723,1.0394459  c0.9589653,0.3805046,1.9220543,0.7780247,2.8246346,1.2805786c0.4473305,0.2490711,0.8738136,0.5299244,1.2980423,0.8159866  c0.0602341,0.0406189,0.0613403,0.033474,0.0751419,0.0952969c0.0149918,0.0671768,0.0072174,0.1532497,0.009819,0.2220707  c0.005043,0.1333485,0.0084686,0.2667618,0.0095367,0.4002037c0.002121,0.2651577-0.0028839,0.5304031-0.0126114,0.7953796  c-0.0779266,2.1226101-0.4223557,4.2300129-0.7044411,6.3321972c-0.2838287,2.1152115-0.5541229,4.230793-0.8068924,6.3499413  C62.930542,43.1604347,62.8690491,43.6759644,62.807579,44.191494z M34.1573563,16.4606094  c-0.2363091-0.3329811-0.309845-0.7579603-0.3544312-1.1552534c-0.0525246-0.4679956-0.0452232-0.9396944-0.0223846-1.409297  c0.0219154-0.4506493,0.049675-0.9155502,0.1703835-1.3523769c0.1055031-0.3817968,0.2943153-0.7349739,0.5230179-1.0566673  c0.4764328-0.6701584,1.1040764-1.2525387,1.7458611-1.7614298c0.6865044-0.5443487,1.4414368-1.0026169,2.2429771-1.3567514  c0.4503021-0.1989498,0.9165955-0.3635883,1.3948174-0.4812732c0.1187973-0.0292339,0.238884-0.0577898,0.3600388-0.0754724  c0.0972557-0.014194,0.2342949-0.0393367,0.3247528,0.0132222c0.0593719,0.0344973,0.0754623,0.0922322,0.0695038,0.1578312  c-0.0038948,0.0428567-0.0413551,0.21452-0.0858078,0.2175345c0.0197182,0.0068464-0.1718903,0.3012753-0.2029991,0.3501329  c-0.0963936,0.1513901-0.1917763,0.3032122-0.2919693,0.452158c-0.2053795,0.3053112-0.4232826,0.6024437-0.6576767,0.886179  c-0.2377205,0.2877655-0.4926567,0.5612316-0.7674561,0.8139572c-0.2714043,0.2496042-0.5581512,0.4838963-0.8058281,0.7581005  c-0.5046844,0.5587349-0.8171234,1.2723064-1.1148949,1.9550676c-0.3125916,0.7167454-0.5945053,1.4480238-0.9423828,2.1489267  c-0.172081,0.3467035-0.372879,0.696332-0.6724777,0.9492502c-0.1377487,0.1162872-0.3147087,0.2236881-0.5020332,0.2128983  C34.3946724,16.7173443,34.2539177,16.5967827,34.1573563,16.4606094z M34.8858528,68.7737045  c-0.3149185-2.883934-0.5744858-5.7736931-0.7452164-8.6698761c-0.169735-2.8793106-0.2581596-5.7618904-0.3276405-8.6451569  c-0.0699234-2.9017296-0.0748863-5.8079109-0.0213623-8.709938c0.0358391-1.9430962,0.116806-3.8842163,0.2016983-5.8255997  c0.0202675-0.4635048,0.0392456-0.9270058,0.0646172-1.3902588c0.0029602-0.0540543-0.0156898-0.2937813,0.0239754-0.323967  c0.0300255-0.02285,0.1664047,0,0.2039223,0c0.062149,0,0.1242981,0,0.1864471,0c0.0511742,0,0.1023521,0,0.1535263,0  c0.0431061,0,0.1806564-0.0245399,0.2165146,0c0.0267944,0.0183411,0.0341988,0.1803856,0.0407219,0.21661  c0.0130043,0.0722008,0.0260124,0.1444016,0.0390015,0.2166061c0.0337639,0.1877251,0.0674095,0.375473,0.1005859,0.5633049  C35.5244598,39.046566,35.875,41.9154739,36.1917,44.7823906c0.3143196,2.8453865,0.5805969,5.6946754,0.7991714,8.549015  c0.2216148,2.8940086,0.4379959,5.7882004,0.5583534,8.688591c0.1212883,2.92276,0.1497383,5.8497314,0.208786,8.7743225  c0.0582657,2.885788,0.1133919,5.7713547,0.1546783,8.6574402c0.0096474,0.6743469,0.0192604,1.3486938,0.0289078,2.0230408  c-0.414505-0.719696-0.8113594-1.4455948-1.0962791-2.2278824c-0.2893143-0.7943649-0.5000725-1.6169891-0.6908684-2.4397888  c-0.3913078-1.6874847-0.6716042-3.3995667-0.9104843-5.1145325C35.1087074,70.7215652,34.9923592,69.7482834,34.8858528,68.7737045  z M35.5113831,91.3432007c-0.3863945-0.3412247-0.7064018-0.709137-0.8983803-1.1936111  c-0.1959915-0.4946136-0.3034973-1.0358047-0.3637543-1.5629349c-0.0617332-0.5400467-0.0367966-1.0750732,0.033741-1.612915  c0.0343094-0.2615967,0.0784531-0.5215225,0.1311035-0.7800217c0.0197105-0.0967636,0.030632-0.2222672,0.086586-0.3058243  c0.1066246-0.1592255,0.1485023,0.219223,0.1585655,0.2779465c0.0471802,0.2753372,0.0993996,0.5506821,0.1599197,0.8234024  c0.1155663,0.5207672,0.2593842,1.0354462,0.4343262,1.5394287c0.1708107,0.4920807,0.3593674,0.9917145,0.6290131,1.43927  c0.262764,0.4361267,0.6250648,0.7827835,1.0249519,1.0927887c0.951622,0.7377243,1.9858589,1.3929138,3.0326004,1.986496  c-0.0249672-0.013855-0.0499382-0.02771-0.0749092-0.0415649c0.1436424,0.0866394,0.290123,0.168663,0.4399529,0.2441406  c-0.0674171-0.0374069-0.1348305-0.0748215-0.2022476-0.1122284c0.5522156,0.3052597,1.1310425,0.5550766,1.6871376,0.8523331  c0.0226402,0.0121002,0.1577301,0.069313,0.1313782,0.1074295c-0.0296288,0.0428543-0.3326225-0.0646515-0.3633652-0.0731125  c-0.3053207-0.0840836-0.6075897-0.1788559-0.9081116-0.2786331c-1.1806068-0.3919983-2.3651543-0.8119736-3.4873199-1.352005  C36.5737,92.110199,36.0029297,91.7772598,35.5113831,91.3432007z M65.5904999,86.193718  c0.2144852,0.9896011,0.2699127,1.994278,0.0702515,2.9902725c-0.0951843,0.4748383-0.2192688,0.9647751-0.4721527,1.3829041  c-0.2330704,0.3853683-0.5854492,0.7021332-0.9373703,0.9773178c-0.7362022,0.5756912-1.6024246,0.9608307-2.4623566,1.3116913  c-0.9317169,0.3801575-1.8840981,0.7232666-2.8450546,1.0220718c-0.2573128,0.0800095-0.5192261,0.1681061-0.7848015,0.2162094  c-0.0842476,0.0152588-0.0958405-0.0112-0.0250816-0.0596848c0.0719872-0.0493317,0.1569366-0.0865555,0.2339439-0.12677  c0.5076981-0.2651749,1.0322876-0.4928589,1.5340576-0.7702637c-0.0674782,0.0374451-0.1349564,0.0748901-0.2024384,0.1123352  c0.1498299-0.0754776,0.2963104-0.1575012,0.4399529-0.2441406c-0.0250092,0.0138779-0.0500183,0.0277557-0.0750275,0.0416336  c0.6229172-0.3532257,1.2309952-0.7356567,1.8274117-1.1318436c0.572628-0.380394,1.1653023-0.7684708,1.6640282-1.2446594  c0.4910049-0.468811,0.7808914-1.0573807,1.025444-1.6818924c0.2593231-0.6622162,0.4612427-1.3465881,0.613266-2.0411377  c0.0440979-0.2014694,0.0809402-0.4042664,0.1181793-0.6070862c0.0164185-0.0894165,0.0328674-0.1785431,0.0466309-0.2683868  c0.0087051-0.0568237,0.0151215-0.1743927,0.0673523-0.2122955C65.5278168,85.7866287,65.5769196,86.1309433,65.5904999,86.193718z   M65.3459244,66.5616913c-0.1973419,2.0211639-0.4208298,4.0386276-0.7167435,6.047966  c-0.2918701,1.9818573-0.6443672,3.9821167-1.2260132,5.9018326c-0.1569443,0.5179977-0.3384323,1.0293884-0.5672493,1.5203094  c-0.2307205,0.4950027-0.5007095,0.9702225-0.7730293,1.4431763c0.0400581-2.8043289,0.0810585-5.608429,0.137722-8.4124756  c0.0572205-2.8316803,0.1145248-5.6633606,0.1718216-8.4950409c0.0573463-2.8342781,0.2149239-5.6717682,0.4297028-8.4983749  c0.2126999-2.7992821,0.4300842-5.5974426,0.7066345-8.391243c0.2771225-2.7995872,0.5999336-5.5939255,0.9889412-8.3802376  c0.097641-0.6993561,0.200798-1.3976097,0.3143768-2.0945816c0.0554352-0.3401794,0.1136856-0.6798782,0.1736984-1.0192795  c0.0293808-0.1661568,0.0591202-0.3322487,0.0889664-0.4983215c0.0155792-0.086647,0.031189-0.1732864,0.0467911-0.2599297  c0.0055237-0.030674,0.0179825-0.201046,0.0407257-0.21661c0.0321732-0.0220108,0.1559219,0,0.194397,0  c0.0579758,0,0.1159515,0,0.1739273,0c0.0556488,0,0.1112976,0,0.1669464,0c0.02948,0,0.1676712-0.0203629,0.1891479,0  c0.0125122,0.0118599,0.0053558,0.0915451,0.0062866,0.1074562c0.0053406,0.0913734,0.0106888,0.1827469,0.0160294,0.2741203  c0.0696411,1.190918,0.1496124,2.381588,0.1976089,3.5735855c0.1133423,2.8143806,0.1505356,5.6311913,0.1340561,8.4477425  c-0.0165787,2.8333015-0.0750809,5.6682777-0.1829987,8.499649c-0.1070633,2.8090401-0.2728882,5.6157951-0.5164642,8.4163971  C65.4822006,65.2063599,65.4121017,65.8838501,65.3459244,66.5616913z M60.027607,7.8591886  c1.4929581,0.341763,2.8904457,1.11974,4.0512733,2.1080785c0.543335,0.4625969,1.0752869,0.9761658,1.4833069,1.5647211  c0.1970901,0.2842855,0.3622437,0.5927916,0.4656601,0.9237795c0.1145172,0.3665094,0.1519394,0.7579889,0.1786728,1.1394091  c0.0543289,0.7751274,0.0956726,1.6122332-0.1274872,2.3663301c-0.0836411,0.2826242-0.245575,0.6729784-0.5645142,0.7534609  c-0.3404541,0.0859127-0.6603851-0.2433376-0.8491898-0.4828358c-0.2221527-0.2817936-0.379425-0.6086292-0.5309067-0.931921  c-0.1741982-0.3717833-0.3342934-0.7499504-0.4935875-1.1282911c-0.308403-0.7324781-0.6026726-1.4883986-1.0276718-2.1632271  c-0.2019958-0.3207359-0.4435234-0.6027527-0.7208328-0.8605881c-0.2793846-0.2597637-0.571331-0.5042944-0.8357315-0.7799597  c-0.5291595-0.5517035-0.9648018-1.1748285-1.3750801-1.8173361c-0.0309181-0.048419-0.2234154-0.3427563-0.2030067-0.3501329  c-0.0408745-0.0027771-0.076416-0.1573925-0.0824509-0.1940861c-0.0095482-0.0580649-0.0073128-0.1215048,0.0396156-0.1635656  C59.5708084,7.7219014,59.8758583,7.8265295,60.027607,7.8591886z" />
                    </svg>
                  </td>
                  <td>{name}</td>
                  <td>{wins}</td>
                  <td>
                    {time}
                    <small>s</small>
                  </td>
                  <td>
                    <button onClick={() => removeWinner(Number(id))}>
                      <IoClose />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
          {currentCars?.length === 0 ? (
            <h1
              style={{
                color: '#fff',
                fontSize: 50,
                textAlign: 'center',
              }}
            >
              there are no winners
            </h1>
          ) : null}
          <footer>
            <div className="cars-quantity">
              <span>garage {`(${data.length})`}</span>
            </div>
            <div className="pagination">
              <select
                onChange={(e: { target: { value: string } }) =>
                  setCarsPerPage(Number(e.target.value))
                }
                value={carsPerPage}
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="7">7</option>
                <option value="10">10</option>
              </select>
              <button
                onClick={() =>
                  setCurrentPage((prev) => {
                    if (prev === 1) return prev
                    else return prev - 1
                  })
                }
              >
                <IoMdArrowDropleft />
              </button>
              <span>Page {currentPage}</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => {
                    if (currentCars?.length == 0) return prev
                    else return prev + 1
                  })
                }
              >
                <IoMdArrowDropright />
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}
