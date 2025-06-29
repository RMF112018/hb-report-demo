"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import {
  Star,
  Plus,
  ThumbsUp,
  MessageSquare,
  Calendar,
  User,
  Filter,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { format } from "date-fns"

interface TradePartnerReviewsProps {
  partner: any
}

// Mock reviews data
const mockReviews = [
  {
    id: "rev-001",
    reviewerId: "user-001",
    reviewerName: "Sarah Johnson",
    reviewerRole: "Project Manager",
    reviewerCompany: "BuildCorp Solutions",
    projectName: "Downtown Office Complex",
    rating: 5,
    categories: {
      quality: 5,
      timeliness: 5,
      communication: 4,
      safety: 5,
      costControl: 5
    },
    comment: "Exceptional work on our office complex project. The team was professional, delivered on time, and exceeded our quality expectations. Their communication throughout the project was outstanding.",
    createdAt: "2024-01-15T10:30:00Z",
    helpfulVotes: 8,
    verified: true,
    projectValue: "$2.4M",
    tags: ["Quality Work", "On Time", "Professional", "Excellent Communication"]
  },
  {
    id: "rev-002",
    reviewerId: "user-002",
    reviewerName: "Michael Chen",
    reviewerRole: "Construction Superintendent",
    reviewerCompany: "Premier Construction",
    projectName: "Residential Tower Phase 2",
    rating: 4,
    categories: {
      quality: 4,
      timeliness: 3,
      communication: 4,
      safety: 5,
      costControl: 4
    },
    comment: "Solid performance overall. Minor delays in material delivery but they communicated proactively and made up time. Safety protocols were excellent throughout the project.",
    createdAt: "2024-01-08T14:20:00Z",
    helpfulVotes: 5,
    verified: true,
    projectValue: "$1.8M",
    tags: ["Good Safety", "Proactive Communication", "Minor Delays"]
  },
  {
    id: "rev-003",
    reviewerId: "user-003",
    reviewerName: "Jennifer Rodriguez",
    reviewerRole: "Project Executive",
    reviewerCompany: "Metro Builders",
    projectName: "Medical Facility Renovation",
    rating: 5,
    categories: {
      quality: 5,
      timeliness: 5,
      communication: 5,
      safety: 5,
      costControl: 4
    },
    comment: "Outstanding partner for our medical facility project. Understood the unique requirements and delivered specialized work flawlessly. Highly recommend for healthcare projects.",
    createdAt: "2023-12-22T09:15:00Z",
    helpfulVotes: 12,
    verified: true,
    projectValue: "$3.2M",
    tags: ["Healthcare Expertise", "Specialized Work", "Outstanding Quality"]
  }
]

const reviewCategories = [
  { key: "quality", label: "Quality of Work", icon: Award },
  { key: "timeliness", label: "Timeliness", icon: Calendar },
  { key: "communication", label: "Communication", icon: MessageSquare },
  { key: "safety", label: "Safety", icon: CheckCircle },
  { key: "costControl", label: "Cost Control", icon: TrendingUp }
]

export function TradePartnerReviews({ partner }: TradePartnerReviewsProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<any[]>([])
  const [showAddReview, setShowAddReview] = useState(false)
  const [activeTab, setActiveTab] = useState("reviews")
  const [filterRating, setFilterRating] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // New review form state
  const [newReview, setNewReview] = useState({
    rating: 0,
    categories: {
      quality: 0,
      timeliness: 0,
      communication: 0,
      safety: 0,
      costControl: 0
    },
    comment: "",
    projectName: "",
    projectValue: ""
  })

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setReviews(mockReviews)
      setLoading(false)
    }
    loadReviews()
  }, [])

  const filteredReviews = reviews.filter(review => {
    if (filterRating === "all") return true
    return review.rating === parseInt(filterRating)
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sortBy === "highest") return b.rating - a.rating
    if (sortBy === "lowest") return a.rating - b.rating
    if (sortBy === "helpful") return b.helpfulVotes - a.helpfulVotes
    return 0
  })

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }))

  const categoryAverages = reviewCategories.map(category => ({
    ...category,
    average: reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.categories[category.key], 0) / reviews.length 
      : 0
  }))

  const handleStarClick = (rating: number, category?: string) => {
    if (category) {
      setNewReview(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: rating
        }
      }))
    } else {
      setNewReview(prev => ({ ...prev, rating }))
    }
  }

  const handleSubmitReview = async () => {
    if (!user) return
    
    const review = {
      id: `rev-${Date.now()}`,
      reviewerId: user.id,
      reviewerName: user.name,
      reviewerRole: user.role,
      reviewerCompany: user.company,
      projectName: newReview.projectName,
      rating: newReview.rating,
      categories: newReview.categories,
      comment: newReview.comment,
      createdAt: new Date().toISOString(),
      helpfulVotes: 0,
      verified: true,
      projectValue: newReview.projectValue,
      tags: []
    }

    setReviews(prev => [review, ...prev])
    setNewReview({
      rating: 0,
      categories: {
        quality: 0,
        timeliness: 0,
        communication: 0,
        safety: 0,
        costControl: 0
      },
      comment: "",
      projectName: "",
      projectValue: ""
    })
    setShowAddReview(false)
  }

  const renderStars = (rating: number, interactive = false, category?: string) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
        onClick={interactive ? () => handleStarClick(i + 1, category) : undefined}
      />
    ))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-2 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#FF6B35]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#003087] dark:text-white">
                Reviews & Ratings
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {reviews.length} reviews from verified project partners
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-lg font-bold text-[#FF6B35]">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <Button 
                onClick={() => setShowAddReview(true)}
                className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#003087] text-white">
                            {review.reviewerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{review.reviewerName}</p>
                            {review.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.reviewerRole} at {review.reviewerCompany}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Project: {review.projectName} • {review.projectValue}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating)}
                          <span className="font-medium">{review.rating}.0</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">{review.comment}</p>
                      
                      {review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {review.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Review Footer */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpfulVotes})
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        Verified project partner
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-white">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{item.rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-[#FF6B35] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Review Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-white">Review Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                    <span className="font-medium">{reviews.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-medium">{averageRating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">5-Star Reviews</span>
                    <span className="font-medium text-green-600">
                      {Math.round((ratingDistribution[0].count / reviews.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verified Reviews</span>
                    <span className="font-medium text-blue-600">
                      {Math.round((reviews.filter(r => r.verified).length / reviews.length) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAverages.map((category) => (
              <Card key={category.key}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <category.icon className="h-5 w-5 text-[#003087] dark:text-white" />
                    <h3 className="font-medium">{category.label}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(category.average))}
                      <span className="font-medium">{category.average.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-[#FF6B35] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(category.average / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Review Modal */}
      {showAddReview && (
        <Card className="border-l-4 border-l-[#FF6B35]">
          <CardHeader>
            <CardTitle className="text-[#003087] dark:text-white">Add Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">Overall Rating</label>
              <div className="flex items-center gap-2">
                {renderStars(newReview.rating, true)}
                <span className="text-sm text-muted-foreground ml-2">
                  {newReview.rating > 0 ? `${newReview.rating}/5` : "Select rating"}
                </span>
              </div>
            </div>

            {/* Category Ratings */}
            <div>
              <label className="text-sm font-medium mb-3 block">Category Ratings</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewCategories.map((category) => (
                  <div key={category.key} className="flex items-center justify-between">
                    <span className="text-sm">{category.label}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(newReview.categories[category.key], true, category.key)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Project Name</label>
                <Input
                  value={newReview.projectName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Project Value</label>
                <Input
                  value={newReview.projectValue}
                  onChange={(e) => setNewReview(prev => ({ ...prev, projectValue: e.target.value }))}
                  placeholder="e.g., $2.5M"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience working with this trade partner..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddReview(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview}
                className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                disabled={!newReview.rating || !newReview.comment || !newReview.projectName}
              >
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 