import { packagesLessons } from "@/constants/packagesLessons"

export const getPackageLesson = (lesson:string) => {
    return packagesLessons
    .filter((currLesson:NameAndId) => currLesson?.name.toLowerCase() === lesson.toLowerCase())[0]
}