const network = {
    Alick: ["Bob", "Charlie"],
  Alice: ["Bob", "Charlie"],
  Bob: ["Alice", "David"],
  Charlie: ["Alice", "Eve"],
  David: ["Bob"],
  Eve: ["Charlie"]
}



console.log(friendRecommendations(network, "Alice"))


function friendRecommendations(network, user) {
    const recommendationsResult = new Set();
    // 자기 자신이랑 직접 연결된 친구들을 미리 설정
    const connected = new Set([user, ...network[user]]);
    // BFS 탐색을 위한 queue
    const queue = [...(network[user] || [])];

    while (queue.length > 0) {
        const friend = queue.shift();

        // 현재 친구의 친구들을 탐색
        for (const nextFriend of network[friend] || []) {
            // 이미 확인한 친구
            if (connected.has(nextFriend)) continue;
            recommendationsResult.add(nextFriend);
            connected.add(nextFriend);
            queue.push(nextFriend);
        }
    }

    return Array.from(recommendationsResult);
}
