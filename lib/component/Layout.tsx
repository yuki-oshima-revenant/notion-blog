import { PostIndex } from "@/lib/util/notion";
import Link from 'next/link';
import { useEffect, useMemo, useState } from "react";
import IndexList from "./IndexList";
import { useRouter } from 'next/router';
import { AiFillGithub, AiOutlineTwitter } from 'react-icons/ai';
import { SiNotion } from 'react-icons/si';
// import { RiUnsplashFill } from 'react-icons/ri';
import Image from 'next/image';

type HierarchyIndex = {
    year: string,
    months: {
        month: string,
        days: {
            date: string,
            ymd: string
        }[]
    }[]
}

const Layout: React.FunctionComponent<{
    postsIndex: PostIndex[],
    ymd?: string
}> = ({
    children,
    postsIndex,
    ymd
}) => {
        const route = useRouter();
        const hierarchyIndex = useMemo(() => {
            const tmpIndex: HierarchyIndex[] = [];
            postsIndex.forEach((index) => {
                const { ymd, year, month, date } = index;
                const yearFind = tmpIndex.find((value) => value.year === year);
                if (yearFind) {
                    const monthFind = yearFind.months.find((value) => value.month === month);
                    if (monthFind) {
                        monthFind.days.push({
                            date,
                            ymd
                        })
                    } else {
                        yearFind.months.push({
                            month: index.month,
                            days: [{
                                date,
                                ymd
                            }]
                        })
                    }
                } else {
                    tmpIndex.push({
                        year,
                        months: [{
                            month,
                            days: [{
                                date,
                                ymd
                            }]
                        }]
                    })
                }
            });
            return tmpIndex;
        }, [postsIndex]);

        const [openedYears, setOpenedYears] = useState<string[]>([]);
        const [openedYearMonths, setOpenedYearMonths] = useState<string[]>([]);

        useEffect(() => {
            if (ymd) {
                const year = ymd.substring(0, 4);
                const month = ymd.substring(4, 6);
                setOpenedYears([...openedYears, year]);
                setOpenedYearMonths([...openedYearMonths, `${year}${month}`]);
            }
        }, [ymd, setOpenedYears, setOpenedYearMonths]);

        return (
            <div>
                <div className="min-h-screen">
                    <div className="w-screen h-48 md:h-64 relative">
                        <Image
                            // src="/peaTniZsUQs.jpg"
                            src="https://source.unsplash.com/peaTniZsUQs"
                            alt="top"
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    <div className=" max-w-6xl mx-auto px-8">
                        <div className="text-white absolute top-4 right-4 cursor-pointer text-2xl md:text-3xl flex">
                            <AiOutlineTwitter
                                className="mr-4"
                                onClick={() => { window.open('https://twitter.com/Re_venant') }}
                            />
                            <AiFillGithub
                                onClick={() => { window.open('https://github.com/yuki-oshima-revenant') }}
                            />
                        </div>
                        <div className="my-8">
                            <h1
                                className="font-bold text-4xl md:text-7xl text-center tracking-tighter titleFont cursor-pointer"
                                onClick={() => { route.push('/') }}
                            >
                                Cartesian Theater
                            </h1>
                            <div className="text-right text-sm my-1 cursor-pointer" onClick={() => { window.open('https://developers.notion.com/') }}>
                                <span>
                                    Powered by Notion
                                </span>
                                <SiNotion className="inline mx-1" />
                                <span>
                                    API
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-6">
                                <div className="order-2 md:order-first md:col-span-1">
                                    <div className="sticky top-8 overflow-auto">
                                        <ul>
                                            {hierarchyIndex.map(({ year, months }) => (
                                                <IndexList
                                                    key={year}
                                                    text={year}
                                                    listKey={year}
                                                    open={openedYears.includes(year)}
                                                    onClick={(open: boolean) => {
                                                        if (open) {
                                                            setOpenedYears([...openedYears].filter((y) => y !== year));
                                                        } else {
                                                            setOpenedYears([...openedYears, year]);
                                                        }
                                                    }}
                                                >
                                                    <ul className="ml-6">
                                                        {months.map(({ month, days }) => (
                                                            <IndexList
                                                                key={`${year}${month}`}
                                                                text={month}
                                                                listKey={`${year}${month}`}
                                                                open={openedYearMonths.includes(`${year}${month}`)}
                                                                onClick={(open: boolean) => {
                                                                    const yearMonth = `${year}${month}`;
                                                                    if (open) {
                                                                        setOpenedYearMonths([...openedYearMonths].filter((ym) => ym !== yearMonth));
                                                                    } else {
                                                                        setOpenedYearMonths([...openedYearMonths, yearMonth]);
                                                                    }
                                                                }}
                                                            >
                                                                <ul className="ml-8">
                                                                    {days.map(({ date, ymd }) => (
                                                                        <li key={ymd}>
                                                                            <Link
                                                                                href={`/post/${encodeURIComponent(ymd)}`}>
                                                                                <a className="underline">{date}</a>
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </IndexList>
                                                        ))}
                                                    </ul>
                                                </IndexList>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-span-5">
                                    {children}
                                </div>
                            </div>
                        </div >
                    </div >
                </div>
                <div className="px-8 py-4 text-center">
                    ©︎2021 Yuki Oshima
                </div>
            </div>


        )
    };

export default Layout;
