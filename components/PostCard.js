export default function PostCard({
  post,
  isLiked,
  uploader,
  getTextAlign,
  handleLike,
  onCommentPress,
}) {
  const textAlign = getTextAlign(post.text);

  const formatNumber = (n) =>
    n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : n;

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={
            uploader.profileImage
              ? { uri: uploader.profileImage }
              : require("../assets/defualt_profil.jpg")
          }
          style={styles.uploaderImage}
        />
        <Text style={styles.uploaderName}>{uploader.userName || "משתמש"}</Text>
      </View>

      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      ) : null}

      <Text
        style={[
          styles.postText,
          {
            textAlign,
            writingDirection: textAlign === "right" ? "rtl" : "ltr",
            alignSelf: textAlign === "right" ? "flex-end" : "flex-start",
          },
        ]}
      >
        {post.text}
      </Text>

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post._id)}
        >
          <FontAwesome
            name={isLiked ? "thumbs-up" : "thumbs-o-up"}
            size={24}
            color={isLiked ? "#8E2DE2" : "#999"}
          />
          <Text style={styles.actionText}>{formatNumber(post.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onCommentPress(post._id)}
        >
          <FontAwesome name="comment-o" size={24} color="#8E2DE2" />
          <Text style={styles.actionText}>
            {formatNumber(post.comments.length)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
