# Local Videos Directory

Place any `.mp4` video files you want hosted directly within the website in this folder:
`C:\AllSaintswebsite\frontend\public\videos\`

### How to use a local video in the website:
1. Copy your `.mp4` video file into this folder:
   e.g. `C:\AllSaintswebsite\frontend\public\videos\school-tour.mp4`

2. Open `src/constants/index.ts` and set the `localVideoPath` property on the corresponding video item:
   ```typescript
   {
     id: "pRwRAYmVIQ4",
     title: "All Saints' Public School - Campus Tour & Heritage",
     category: "Campus Life & Ceremonies",
     localVideoPath: "/videos/school-tour.mp4", // <-- Local MP4 file
     embedUrl: "https://www.youtube.com/embed/pRwRAYmVIQ4",
     youtubeUrl: "https://www.youtube.com/watch?v=pRwRAYmVIQ4",
   }
   ```

3. The video player in `/gallery` and the homepage spotlight will automatically play your local `.mp4` file directly without relying on an internet connection or YouTube!
