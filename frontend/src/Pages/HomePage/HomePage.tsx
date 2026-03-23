import { useCallback, useEffect, useState } from "react";
import InstagramComponent from "../../Components/InstagramComponent/InstagramComponent.component";
import Pagination from "../../Components/Pagination/Pagination.component";
import Masonry from "react-masonry-css";
import { apiUrl } from "../../config/api";
import {
  POSTS_PER_PAGE,
  type PaginationMeta,
} from "../../config/pagination";

interface Ad {
  _id: string;
  id: number;
  user_id: string;
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  instagram_post_url: string;
  keywords: string[];
  created_at: string;
}

const HomePage: React.FC = () => {
  const [frontPageAds, setFrontPageAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const loadAds = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const url = apiUrl(
        `/api/ads/most-recent?page=${pageNum}&limit=${POSTS_PER_PAGE}`,
      );
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          "Failed to load ads:",
          response.status,
          response.statusText,
          url,
        );
        return;
      }
      const data = await response.json();
      if (data.success) {
        setFrontPageAds(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
          const tp = data.pagination.totalPages as number;
          if (pageNum > tp && tp >= 1) {
            setPage(tp);
          }
        } else {
          setPagination(null);
        }
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAds(page);
  }, [page, loadAds]);

  const removeAdFromFrontPage = (deletedId: number) => {
    setFrontPageAds((prevAds) => prevAds.filter((ad) => ad.id !== deletedId));
    loadAds(page);
  };

  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    768: 2,
    640: 1,
  };

  if (loading && frontPageAds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-xl text-gray-600">Loading ads...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {loading && (
          <p className="text-center text-sm text-gray-500 mb-4">Updating…</p>
        )}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {frontPageAds.map((ad) => (
            <InstagramComponent
              key={ad.id.toString()}
              ad={ad}
              onDelete={removeAdFromFrontPage}
            />
          ))}
        </Masonry>

        {pagination && (
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
            disabled={loading}
          />
        )}

        {!loading && frontPageAds.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-600">
            No posts yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
