import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import * as api from "../../shared/services/api";

export const downloadDocument = async (documentId: number, fileName: string) => {
  try {

    // ✅ Web browser download
    if (Platform.OS === "web") {
      const blob = await api.downloadDocumentById(documentId);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

      a.href = url;
      a.download = sanitizedFileName;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return;
    }

    // ---------------------------
    // Android direct download
    // ---------------------------
    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        Alert.alert('Downloading', 'Your file is being downloaded...');

        const blob = await api.downloadDocumentById(documentId);

        const reader = new FileReader();
        reader.readAsDataURL(blob);

        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
        });

        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const mimeType = blob.type || 'application/octet-stream';

        const uri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          sanitizedFileName,
          mimeType
        );

        await FileSystem.writeAsStringAsync(uri, base64Data, {
          encoding: FileSystem.EncodingType.Base64
        });

        Alert.alert('Download Complete', `File saved: ${sanitizedFileName}`);
        return;
      }
    }

    // ---------------------------
    // iOS fallback
    // ---------------------------
    Alert.alert('Downloading', 'Preparing your file for sharing...');

    const blob = await api.downloadDocumentById(documentId);

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    const base64Data = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });

    const fileUri = FileSystem.cacheDirectory + fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, { dialogTitle: 'Save or share your document' });
    } else {
      Alert.alert('Sharing Not Available', 'Could not open the share dialog.');
    }

  } catch (err: any) {
    console.error('Download failed', err);
    Alert.alert('Error', err.message || 'Failed to download document');
  }
};