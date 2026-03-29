import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InstagramComponent from "../../Components/InstagramComponent/InstagramComponent.component";
import Pagination from "../../Components/Pagination/Pagination.component";
import Masonry from "react-masonry-css";
import { apiUrl } from "../../config/api";
import {
  POSTS_PER_PAGE,
  type PaginationMeta,
} from "../../config/pagination";
import { normalizeTag } from "../../utils/tags";

interface Ad {
  id: number;
  user_id: string;
  title: string;
  description: string;
  instagram_post_url: string;
  keywords: string[];
  country?: string;
  state?: string;
  city?: string;
}

const TagsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryKeyword = searchParams.get("q") || "";
  const pageFromUrl = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  const [typedTag, setTypedTag] = useState(queryKeyword);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  useEffect(() => {
    setTypedTag(queryKeyword);
  }, [queryKeyword]);

  useEffect(() => {
    const fetchAds = async () => {
      if (!queryKeyword) {
        setAds([]);
        setPagination(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const cleanTag = normalizeTag(decodeURIComponent(queryKeyword));

      try {
        const response = await fetch(
          apiUrl(
            `/api/ads/ads-by-tag/${encodeURIComponent(cleanTag)}?page=${pageFromUrl}&limit=${POSTS_PER_PAGE}`,
          ),
        );
        const json = await response.json();
        setAds(json.data || []);
        if (json.pagination) {
          setPagination(json.pagination);
          const tp = json.pagination.totalPages as number;
          if (pageFromUrl > tp && tp >= 1) {
            const next = new URLSearchParams();
            next.set("q", decodeURIComponent(queryKeyword));
            if (tp > 1) next.set("page", String(tp));
            setSearchParams(next, { replace: true });
          }
        } else {
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [queryKeyword, pageFromUrl, setSearchParams]);

  const handleTagChange = (value: string) => {
    setTypedTag(value);
  };

  const lookupTag = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeTag(typedTag);
    const params = new URLSearchParams();
    params.set("q", normalized);
    setSearchParams(params);
  };

  const handleTagClick = (tag: string) => {
    setTypedTag(tag);
    const normalized = normalizeTag(tag);
    const params = new URLSearchParams();
    params.set("q", normalized);
    setSearchParams(params);
  };

  const handlePageChange = (p: number) => {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(p));
    }
    if (queryKeyword) {
      next.set("q", decodeURIComponent(queryKeyword));
    }
    setSearchParams(next);
  };

  const showEmptyNoResults = useMemo(
    () => !loading && queryKeyword && ads.length === 0,
    [loading, queryKeyword, ads.length],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Tags Page</h2>
          {queryKeyword && (
            <h3 className="text-xl text-gray-600">
              Selected keyword: {decodeURIComponent(queryKeyword)}
            </h3>
          )}
        </div>

        <form
          onSubmit={lookupTag}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={typedTag}
              onChange={(e) => handleTagChange(e.target.value)}
              placeholder="Search by tag"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm md:text-base"
            >
              Search Tag
            </button>
          </div>
        </form>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-xl text-gray-600">Loading ads...</p>
            </div>
          </div>
        ) : ads.length > 0 ? (
          <>
            <Masonry
              breakpointCols={{ default: 3, 1024: 3, 768: 2, 640: 1 }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {ads.map((ad) => (
                <InstagramComponent
                  key={ad.id.toString()}
                  ad={ad}
                  onTagClick={handleTagClick}
                />
              ))}
            </Masonry>
            {pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            )}
          </>
        ) : showEmptyNoResults ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600">No ads found for this tag.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TagsPage;
