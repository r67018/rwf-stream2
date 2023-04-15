export const useEditBoxSingle = () => {
    const edit = ref<any>()

    const handleSubmit = (callback: () => {}) => {
      callback()
    }

    return {
        edit,
        handleSubmit,
    }
}
