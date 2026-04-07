package com.signox.player.data.dto

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class ScrollTextData(
    val id: String,
    val text: String,
    val direction: String, // "left-to-right", "right-to-left", "top-to-bottom", "bottom-to-top"
    val speed: Int, // pixels per second
    val fontSize: Int,
    val textColor: String, // hex color
    val fontWeight: String = "normal", // "normal", "bold"
    val backgroundColor: String = "transparent",
    val isOverlay: Boolean = false,
    val x: Double, // percentage
    val y: Double, // percentage
    val width: Double, // percentage
    val height: Double, // percentage
    val zIndex: Int = 0,
    val sectionId: String? = null
) : Parcelable