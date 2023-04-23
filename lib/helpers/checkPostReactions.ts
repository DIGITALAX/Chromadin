import hasReactedPost from "@/graphql/lens/queries/hasReacted";

const checkPostReactions = async (
  publicationObject: any,
  lensProfile: string | undefined
): Promise<any> => {
  let hasReactedArr: any[] = [];
  try {
    const hasReacted = await hasReactedPost(publicationObject, {
      profileId: lensProfile,
    });
    for (let i = hasReacted.data.publications.items.length - 1; i >= 0; i--) {
      if (hasReacted.data.publications.items[i].reaction === "UPVOTE") {
        hasReactedArr.push(true);
      } else {
        hasReactedArr.push(false);
      }
    }
    const reversedArr = hasReactedArr.reverse();
    const lastTwo = reversedArr.splice(-2);
    [lastTwo[0], lastTwo[1]] = [lastTwo[1], lastTwo[0]];
    reversedArr.unshift(...lastTwo.reverse());
    return reversedArr;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkPostReactions;
