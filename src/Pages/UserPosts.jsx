import postService from '@/appwrite/post';
import { removePost, setUserPosts } from '@/store/postSlice';
import { Query } from 'appwrite';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserPostTable from '@/Components/UserPostTable';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Check } from 'lucide-react';

function UserPosts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userPosts = useSelector((state) => state.post.userPosts);
  const userData = useSelector((state) => state.auth.userData);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filterTab, setFilterTab] = useState('date'); // 'tags' or 'date'
  const [dateFilter, setDateFilter] = useState(''); // Applied filter
  const [selectedTags, setSelectedTags] = useState([]); // Applied tags
  const [tempDateFilter, setTempDateFilter] = useState(''); // Temporary selection
  const [tempSelectedTags, setTempSelectedTags] = useState([]); // Temporary tags
  const [tagSearchQuery, setTagSearchQuery] = useState(''); // Search tags
  const filterRef = useRef(null);
  const postsPerPage = 6;

  // Dummy tags - Future feature: These will be fetched from backend/database
  const availableTags = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'Tailwind', 'Web Dev', 'Tutorial'];

  useEffect(() => {
    if (userData?.$id) {
      postService.getPosts([Query.equal("userId", userData.$id)]).then((posts) => {
        if (posts) {
          dispatch(setUserPosts({ userPosts: posts.rows }));
        }
      });
    }
  }, [userData?.$id, dispatch]);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to permanently delete this post? This action cannot be undone.")) {
      try {
        await postService.deletePost(postId);
        dispatch(removePost(postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleRestore = async (postId) => {
    try {
      const post = userPosts.find(p => p.$id === postId);
      if (!post) return;

      const updatedPost = await postService.updatePost(postId, {
        title: post.title,
        content: post.content,
        featuredImage: post.featuredImage,
        status: "active",
        publishStatus: post.publishStatus,
      });

      if (updatedPost) {
        // Refresh the posts list
        const posts = await postService.getPosts([Query.equal("userId", userData.$id)]);
        if (posts) {
          dispatch(setUserPosts({ userPosts: posts.rows }));
        }
      }
    } catch (error) {
      console.error("Error restoring post:", error);
    }
  };

  // Handle search with useCallback
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  }, []);

  // Filter posts by date
  const filterByDate = (post) => {
    if (!dateFilter) return true;
    
    const postDate = new Date(post.$createdAt);
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    switch (dateFilter) {
      case 'previous-day':
        const yesterday = new Date(now - dayInMs);
        return postDate.toDateString() === yesterday.toDateString();
      case 'past-3-days':
        return (now - postDate) <= (3 * dayInMs);
      case 'past-week':
        return (now - postDate) <= (7 * dayInMs);
      case 'past-month':
        return (now - postDate) <= (30 * dayInMs);
      default:
        return true;
    }
  };

  // Apply filters
  const applyFilters = () => {
    setDateFilter(tempDateFilter);
    setSelectedTags(tempSelectedTags);
    setShowFilterDialog(false);
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setTempDateFilter('');
    setTempSelectedTags([]);
    setTagSearchQuery('');
  };

  // Close filter dialog and reset temp values
  const closeFilterDialog = () => {
    setShowFilterDialog(false);
    setTempDateFilter(dateFilter);
    setTempSelectedTags(selectedTags);
    setTagSearchQuery('');
  };

  // Open filter dialog
  const openFilterDialog = () => {
    setTempDateFilter(dateFilter);
    setTempSelectedTags(selectedTags);
    setTagSearchQuery('');
    setShowFilterDialog(true);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        closeFilterDialog();
      }
    };

    if (showFilterDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDialog, dateFilter, selectedTags]);

  // Filter posts based on active tab, search query, and filters
  const filteredPosts = userPosts.filter(post => {
    // Filter by tab
    if (activeTab === 'published' && (post.publishStatus !== 'published' || post.status !== 'active')) return false;
    if (activeTab === 'drafts' && (post.publishStatus !== 'draft' || post.status !== 'active')) return false;
    if (activeTab === 'deleted' && post.status !== 'deleted') return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!post.title.toLowerCase().includes(query)) return false;
    }
    
    // Filter by date
    if (!filterByDate(post)) return false;
    
    // Filter by tags - Future feature: Posts will have a 'tags' field from backend
    // For now, this will not filter anything since posts don't have tags yet
    // When implemented, posts should have a tags array field (e.g., post.tags: ['React', 'JavaScript'])
    if (selectedTags.length > 0) {
      // Future implementation:
      // if (!post.tags || !selectedTags.some(tag => post.tags.includes(tag))) return false;
      
      // Temporary: Show all posts when tags are selected (no filtering until backend ready)
      // Remove this comment block once backend tags are implemented
    }
    
    return true;
  });

  // Calculate counts
  const publishedCount = userPosts.filter(p => p.publishStatus === 'published' && p.status === 'active').length;
  const draftsCount = userPosts.filter(p => p.publishStatus === 'draft' && p.status === 'active').length;
  const deletedCount = userPosts.filter(p => p.status === 'deleted').length;

  // Pagination calculations
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const tabs = [
    { id: 'all', label: 'All', count: userPosts.length },
    { id: 'published', label: 'Published', count: publishedCount },
    { id: 'drafts', label: 'Drafts', count: draftsCount },
    { id: 'deleted', label: 'Trash', count: deletedCount },
  ];

  return (
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#2a2d31] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1f2226] dark:text-[#e8e6e3] mb-1">
            Blogs and drafts
          </h1>
          <p className="text-sm text-[#6a6e73] dark:text-[#9aa0a6]">
            Status overview of your blogs and drafts
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-4 border-b border-[#e5e4e0] dark:border-[#3a3d41]">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2 px-1 text-sm font-medium transition-colors relative cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#1f2226] dark:text-[#e8e6e3]'
                    : 'text-[#6a6e73] dark:text-[#9aa0a6] hover:text-[#4f5358] dark:hover:text-[#c5c3bf]'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#e5e4e0] dark:bg-[#3a3d41] text-[#4f5358] dark:text-[#c5c3bf]">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a8956b]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6e73] dark:text-[#9aa0a6]" />
            <input
              type="text"
              placeholder="Search articles"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-[#e5e4e0] dark:border-[#4a4d52] bg-white dark:bg-[#35383c] text-[#1f2226] dark:text-[#e8e6e3] placeholder:text-[#9aa0a6] focus:outline-none focus:ring-2 focus:ring-[#a8956b] transition-colors"
            />
          </div>
          <div ref={filterRef} className="relative">
            <button
              onClick={openFilterDialog}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e5e4e0] dark:border-[#4a4d52] bg-white dark:bg-[#35383c] text-[#6a6e73] dark:text-[#9aa0a6] hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31] transition-colors cursor-pointer"
              title="Filter options"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>

            {/* Filter Dropdown Menu */}
            {showFilterDialog && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#35383c] rounded-xl shadow-2xl z-50 border border-[#e5e4e0] dark:border-[#4a4d52]">
                {/* Filter Tabs */}
                <div className="flex border-b border-[#e5e4e0] dark:border-[#4a4d52] p-3">
                  <button
                    onClick={() => setFilterTab('tags')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer relative ${
                      filterTab === 'tags'
                        ? 'bg-[#f8f7f4] dark:bg-[#2a2d31] text-[#1f2226] dark:text-[#e8e6e3]'
                        : 'text-[#6a6e73] dark:text-[#9aa0a6] hover:text-[#4f5358] dark:hover:text-[#c5c3bf]'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      Tags
                      {tempSelectedTags.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilterTab('date')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer relative ${
                      filterTab === 'date'
                        ? 'bg-[#f8f7f4] dark:bg-[#2a2d31] text-[#1f2226] dark:text-[#e8e6e3]'
                        : 'text-[#6a6e73] dark:text-[#9aa0a6] hover:text-[#4f5358] dark:hover:text-[#c5c3bf]'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      Date
                      {tempDateFilter && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      )}
                    </span>
                  </button>
                </div>

                {/* Filter Content */}
                <div className="p-3 max-h-80 overflow-y-auto">
                  {filterTab === 'tags' ? (
                    <>
                      {/* Tag Search Bar - Future feature: Will search from database tags */}
                      <div className="mb-3 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6e73] dark:text-[#9aa0a6]" />
                        <input
                          type="text"
                          placeholder="Search tags"
                          value={tagSearchQuery}
                          onChange={(e) => setTagSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-[#e5e4e0] dark:border-[#4a4d52] bg-[#f8f7f4] dark:bg-[#2a2d31] text-[#1f2226] dark:text-[#e8e6e3] placeholder:text-[#9aa0a6] focus:outline-none focus:ring-2 focus:ring-[#a8956b] transition-colors"
                        />
                      </div>
                      
                      {/* Tag List with Checkboxes */}
                      <div className="space-y-1.5">
                        {availableTags
                          .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
                          .map((tag) => (
                            <label
                              key={tag}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31] transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={tempSelectedTags.includes(tag)}
                                onChange={() => {
                                  if (tempSelectedTags.includes(tag)) {
                                    setTempSelectedTags(tempSelectedTags.filter(t => t !== tag));
                                  } else {
                                    setTempSelectedTags([...tempSelectedTags, tag]);
                                  }
                                }}
                                className="w-4 h-4 rounded border-[#e5e4e0] dark:border-[#4a4d52] text-[#a8956b] focus:ring-[#a8956b] focus:ring-offset-0"
                              />
                              <span className="text-[#4f5358] dark:text-[#c5c3bf]">{tag}</span>
                            </label>
                          ))}
                        
                        {/* No results message */}
                        {availableTags.filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase())).length === 0 && (
                          <p className="text-center py-4 text-sm text-[#6a6e73] dark:text-[#9aa0a6]">
                            No tags found
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setTempDateFilter('previous-day')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          tempDateFilter === 'previous-day'
                            ? 'bg-[#f8f7f4] dark:bg-[#2a2d31]'
                            : 'hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31]'
                        }`}
                      >
                        <span className="text-[#4f5358] dark:text-[#c5c3bf]">Previous day</span>
                        {tempDateFilter === 'previous-day' && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                      <button
                        onClick={() => setTempDateFilter('past-3-days')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          tempDateFilter === 'past-3-days'
                            ? 'bg-[#f8f7f4] dark:bg-[#2a2d31]'
                            : 'hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31]'
                        }`}
                      >
                        <span className="text-[#4f5358] dark:text-[#c5c3bf]">Past 3 days</span>
                        {tempDateFilter === 'past-3-days' && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                      <button
                        onClick={() => setTempDateFilter('past-week')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          tempDateFilter === 'past-week'
                            ? 'bg-[#f8f7f4] dark:bg-[#2a2d31]'
                            : 'hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31]'
                        }`}
                      >
                        <span className="text-[#4f5358] dark:text-[#c5c3bf]">Past week</span>
                        {tempDateFilter === 'past-week' && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                      <button
                        onClick={() => setTempDateFilter('past-month')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          tempDateFilter === 'past-month'
                            ? 'bg-[#f8f7f4] dark:bg-[#2a2d31]'
                            : 'hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31]'
                        }`}
                      >
                        <span className="text-[#4f5358] dark:text-[#c5c3bf]">Past month</span>
                        {tempDateFilter === 'past-month' && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Filter Footer */}
                <div className="flex gap-2 p-3 border-t border-[#e5e4e0] dark:border-[#4a4d52]">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-[#6a6e73] dark:text-[#9aa0a6] hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31] transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={applyFilters}
                    disabled={!tempDateFilter && tempSelectedTags.length === 0}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !tempDateFilter && tempSelectedTags.length === 0
                        ? 'bg-[#9aa0a6] text-white cursor-not-allowed opacity-50'
                        : 'bg-[#a8956b] hover:bg-[#96855f] text-white cursor-pointer'
                    }`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Posts Table */}
        <UserPostTable posts={currentPosts} onDelete={handleDelete} onRestore={handleRestore} />

        {/* Pagination */}
        {totalPosts > 0 && (
          <div className="mt-4 flex items-center justify-between">
            {/* Showing X-Y of Z posts */}
            <div className="text-sm text-[#6a6e73] dark:text-[#9aa0a6]">
              Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} posts
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'text-[#9aa0a6] dark:text-[#6a6e73] cursor-not-allowed'
                      : 'text-[#4f5358] dark:text-[#c5c3bf] hover:bg-[#f8f7f4] dark:hover:bg-[#35383c] cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                    // Show ellipsis
                    const showEllipsisBefore = pageNumber === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = pageNumber === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <span
                          key={pageNumber}
                          className="px-2 text-[#6a6e73] dark:text-[#9aa0a6]"
                        >
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`min-w-8 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                          currentPage === pageNumber
                            ? 'bg-[#a8956b] text-white'
                            : 'text-[#4f5358] dark:text-[#c5c3bf] hover:bg-[#f8f7f4] dark:hover:bg-[#35383c]'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'text-[#9aa0a6] dark:text-[#6a6e73] cursor-not-allowed'
                      : 'text-[#4f5358] dark:text-[#c5c3bf] hover:bg-[#f8f7f4] dark:hover:bg-[#35383c] cursor-pointer'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPosts;