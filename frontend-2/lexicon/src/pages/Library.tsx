import { useEffect, useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LessonCard } from "@/components/dashboard/LessonCard";
import { mockLessons, categories } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { endpoints } from "@/lib/api";
import type { LessonDTO } from "@/lib/types";

type SortOption = "recommended" | "newest" | "popular" | "duration";
type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

export default function Library() {
  const [lessons, setLessons] = useState<LessonDTO[]>(mockLessons);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [categoryList, setCategoryList] = useState<string[]>(categories);

  // Load categories from API
  useEffect(() => {
    endpoints.categories
      .list()
      .then(setCategoryList)
      .catch(() => setCategoryList(categories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch lessons when filters/search change
  useEffect(() => {
    const query: Record<string, string | number | boolean | undefined> = {
      search: searchQuery || undefined,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
      sort: sortBy,
      page: 1,
      limit: 30,
    };
    endpoints.lessons
      .list(query)
      .then((res) => setLessons(res.items))
      .catch(() => setLessons(mockLessons));
  }, [searchQuery, selectedCategory, difficultyFilter, sortBy]);

  const handleToggleFavorite = (id: string) => {
    // Optimistic toggle then confirm via API
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, isFavorite: !lesson.isFavorite } : lesson
      )
    );
    endpoints.lessons.toggleFavorite(id).catch(() => {
      // Revert on failure
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === id ? { ...lesson, isFavorite: !lesson.isFavorite } : lesson
        )
      );
    });
  };

  // Filter lessons
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;

    const matchesDifficulty =
      difficultyFilter === "all" || lesson.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort lessons
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    switch (sortBy) {
      case "duration":
        return a.duration - b.duration;
      case "newest":
        return b.id.localeCompare(a.id);
      case "popular":
        return (b.progress || 0) - (a.progress || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold">Course Library</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive collection of courses and lessons
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lessons, topics, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="duration">Shortest First</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={difficultyFilter}
            onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categoryList.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                selectedCategory === category &&
                  "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedLessons.length} {sortedLessons.length === 1 ? "lesson" : "lessons"}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        {(searchQuery || selectedCategory !== "All" || difficultyFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setDifficultyFilter("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Lessons Grid */}
      {sortedLessons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-heading font-semibold mb-2">
            No lessons found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setDifficultyFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
