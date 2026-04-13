import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getReviews } from "../../../services/ReviewService";
import { ReviewDocument } from "../../../types/CourtServerTypes";
import { CreateReviewModal } from "./CreateReviewModal";
import { ImageViewerModal } from "./ImageViewerModal";
import { ReviewCard } from "./ReviewCard";

interface CourtServerReviewsProps {
  courtServerId: string;
  isCreateModalVisible: boolean;
  onCreateModalClose: () => void;
}

const CourtServerReviews = ({
  courtServerId,
  isCreateModalVisible,
  onCreateModalClose,
}: CourtServerReviewsProps) => {
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Image viewer state
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const fetched = await getReviews(courtServerId);
      setReviews(fetched);
      setHasMore(fetched.length >= 10);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [courtServerId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || reviews.length === 0) return;
    setLoadingMore(true);
    try {
      const lastReview = reviews[reviews.length - 1];
      const moreReviews = await getReviews(courtServerId, lastReview.createdAt);
      setReviews((prev) => [...prev, ...moreReviews]);
      setHasMore(moreReviews.length >= 10);
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleImagePress = (imageUrls: string[], startIndex: number) => {
    setViewerImages(imageUrls);
    setViewerInitialIndex(startIndex);
    setViewerVisible(true);
  };

  const renderItem = ({ item }: { item: ReviewDocument }) => (
    <ReviewCard
      review={item}
      courtId={courtServerId}
      onImagePress={handleImagePress}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BottomSheetFlatList<ReviewDocument>
        data={reviews}
        keyExtractor={(item: ReviewDocument) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No reviews yet.</Text>
            <Text style={styles.emptySubText}>
              Be the first to review this court!
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#F97316"
              style={{ paddingVertical: 16 }}
            />
          ) : null
        }
      />

      <CreateReviewModal
        visible={isCreateModalVisible}
        onClose={onCreateModalClose}
        courtId={courtServerId}
        onReviewCreated={loadReviews}
      />

      <ImageViewerModal
        visible={viewerVisible}
        imageUrls={viewerImages}
        initialIndex={viewerInitialIndex}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptySubText: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
  },
});

export default CourtServerReviews;
