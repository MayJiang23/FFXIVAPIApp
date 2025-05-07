async function getQuestFields() {
    try {
      let response =
        await api.get(`/api/quest`);
        if (response.data) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
      console.error("Error fetching map row: ", error);
      return null;
    }
};