"use client";

import { useEffect, useState, useRef } from "react";
import DeskSetupCard from "./DeskSetupCard";
import { datas } from "./data";
import Link from "next/link";
import SortDropdown from "./SortDropdown";
import StyleFilter from "./StyleFilter";
import ColorFilter from "./ColorFilter";
import JobFilter from "./JobFilter";

// 최근 일주일을 계산하는 함수
const getOneWeekAgoDate = () => {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  return oneWeekAgo.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
};

export default function DeskSetupPage() {
  const [recentTopPosts, setRecentTopPosts] = useState([]);
  const [allPosts, setAllPosts] = useState(datas);
  const [filteredData, setFilteredData] = useState(datas);
  const [sortOrder, setSortOrder] = useState("latest");
  const [styleFilter, setStyleFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [displayedCount, setDisplayedCount] = useState(9);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  const loadMoreRef = useRef(null); // "Load More" 버튼의 ref

  useEffect(() => {
    const oneWeekAgo = getOneWeekAgoDate();

    // 최근 일주일 내의 게시글 필터링
    const recentPosts = datas.filter((data) => data.createdAt >= oneWeekAgo);

    // 인기 게시글 정렬 (조회수 * 좋아요 수) 기준
    const sortedPosts = recentPosts
      .map((post) => ({
        ...post,
        score:
          parseInt(post.views.replace(/,/g, "")) *
          parseInt(post.likes.replace(/,/g, "")),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // 상위 3개 선택

    setRecentTopPosts(sortedPosts);
  }, []);

  useEffect(() => {
    let sortedData = [...allPosts];

    // 필터링
    if (styleFilter !== "all") {
      sortedData = sortedData.filter((data) => data.style === styleFilter);
    }
    if (colorFilter !== "all") {
      sortedData = sortedData.filter((data) => data.color === colorFilter);
    }
    if (jobFilter !== "all") {
      sortedData = sortedData.filter((data) => data.job === jobFilter);
    }

    // 검색 필터링
    if (searchTerm) {
      sortedData = sortedData.filter(
        (data) =>
          data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    if (sortOrder === "latest") {
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "likes") {
      sortedData.sort(
        (a, b) =>
          parseInt(b.likes.replace(/,/g, "")) -
          parseInt(a.likes.replace(/,/g, ""))
      );
    } else if (sortOrder === "views") {
      sortedData.sort(
        (a, b) =>
          parseInt(b.views.replace(/,/g, "")) -
          parseInt(a.views.replace(/,/g, ""))
      );
    }

    setFilteredData(sortedData);
  }, [sortOrder, styleFilter, colorFilter, jobFilter, allPosts, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      // 페이지 전체 문서 높이와 현재 스크롤 위치를 비교하여 페이지 하단에 도달했는지 확인
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트 될 때 스크롤 이벤트 핸들러 제거
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredData, displayedCount]);

  useEffect(() => {
    // "Load More" 버튼이 뷰포트에 들어오는지 확인하기 위해 IntersectionObserver 사용
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < filteredData.length) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [filteredData, displayedCount]);

  const loadMore = () => {
    setDisplayedCount((prevCount) =>
      Math.min(prevCount + 9, filteredData.length)
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-pretendard font-bold text-3xl mb-1">최근 데스크셋업 인기 순위</h1>
        <h3 className="font-pretendard font-light text-2xl text-[#A4A4A4] mb-4">이번주 인기 급상승</h3>
        <div className="grid grid-cols-3 gap-5 mb-12">
          {recentTopPosts.map((data) => (
            <DeskSetupCard key={data.id} data={data} />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="font-pretendard font-bold text-3xl">게시된 데스크셋업</h1>
          <div className="relative flex items-center">
            <img
              src="/search.png"
              alt="Search"
              className="absolute left-3 w-4 h-4"
            />
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 bg-gray-50 text-gray-400 border rounded"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            <StyleFilter styleFilter={styleFilter} setStyleFilter={setStyleFilter} />
            <ColorFilter colorFilter={colorFilter} setColorFilter={setColorFilter} />
            <JobFilter jobFilter={jobFilter} setJobFilter={setJobFilter} />
          </div>
          <Link
            className="font-pretendard bg-[#FF6E30] text-white px-2 py-3 rounded-lg"
            href="/deskSetup/create"
          >
            나의 데스크셋업 공유하기
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filteredData.slice(0, displayedCount).map((data) => (
            <div key={data.id}>
              <DeskSetupCard data={data} />
            </div>
          ))}
        </div>

        <button
          ref={loadMoreRef} // "Load More" 버튼에 ref를 설정
          className="text-blue-500 mt-4"
        >
          Load More
        </button>
      </div>
    </div>
  );
}
