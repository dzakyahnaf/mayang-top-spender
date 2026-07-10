<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait CompressesReceiptPhotos
{
    /**
     * Downscale (max 1600px on the longest side) and re-encode the uploaded
     * receipt photo as a quality-75 JPEG so stored files stay small,
     * regardless of the original format or resolution.
     */
    private function compressAndStoreReceipt(UploadedFile $file): string
    {
        $source = match ($file->getMimeType()) {
            'image/jpeg', 'image/jpg' => function_exists('imagecreatefromjpeg') ? imagecreatefromjpeg($file->getRealPath()) : null,
            'image/png' => function_exists('imagecreatefrompng') ? imagecreatefrompng($file->getRealPath()) : null,
            'image/webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($file->getRealPath()) : null,
            default => null,
        };

        if (! $source) {
            return $file->store('receipts', 'local');
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $maxDimension = 1600;
        $ratio = min(1, $maxDimension / max($width, $height));
        $newWidth = (int) round($width * $ratio);
        $newHeight = (int) round($height * $ratio);

        $canvas = imagecreatetruecolor($newWidth, $newHeight);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($source);

        $path = 'receipts/'.Str::random(32).'.jpg';
        Storage::disk('local')->makeDirectory('receipts');
        imagejpeg($canvas, Storage::disk('local')->path($path), 75);
        imagedestroy($canvas);

        return $path;
    }
}
