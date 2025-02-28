export const audioType = filename => {
  const extension = filename.split('.').pop();
  switch (extension) {
    case 'wav':
      return 'audio/wav';
    case 'mp3':
      return 'audio/mpeg';
    case 'ogg':
      return 'audio/ogg';
    case 'flac':
      return 'audio/flac';
    case 'm4a':
      return 'audio/mp4';
    default:
      return 'audio/wav';
  }
}
