package com.signox.player.ui.views

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Color
import android.util.AttributeSet
import android.util.Log
import android.view.Gravity
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.signox.player.data.dto.ScrollTextData

class ScrollingTextView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private val textView: TextView
    private var scrollTextData: ScrollTextData? = null
    private var animator: ValueAnimator? = null
    private var isPlaying = false

    companion object {
        private const val TAG = "ScrollingTextView"
    }

    init {
        textView = TextView(context).apply {
            gravity = Gravity.CENTER
            setSingleLine(true)
        }
        addView(textView)
    }

    fun setScrollText(scrollText: ScrollTextData) {
        this.scrollTextData = scrollText
        
        textView.apply {
            text = scrollText.text
            textSize = scrollText.fontSize.toFloat()
            setTextColor(Color.parseColor(scrollText.textColor))
            
            // Set font weight
            when (scrollText.fontWeight.lowercase()) {
                "bold" -> setTypeface(typeface, android.graphics.Typeface.BOLD)
                "normal" -> setTypeface(typeface, android.graphics.Typeface.NORMAL)
                else -> setTypeface(typeface, android.graphics.Typeface.NORMAL)
            }
        }
        
        setBackgroundColor(Color.parseColor(scrollText.backgroundColor))
        
        Log.d(TAG, "ScrollingTextView configured: ${scrollText.text}, direction: ${scrollText.direction}")
    }

    fun startScrolling() {
        val scrollData = scrollTextData ?: return
        
        if (isPlaying) return
        isPlaying = true
        
        // Check if this is a vertical direction that needs letter-by-letter scrolling
        val isVerticalLetterByLetter = scrollData.direction == "top-to-bottom" || scrollData.direction == "bottom-to-top"
        
        if (isVerticalLetterByLetter) {
            startLetterByLetterAnimation(scrollData)
        } else {
            startTraditionalScrolling(scrollData)
        }
    }

    private fun startLetterByLetterAnimation(scrollData: ScrollTextData) {
        val fullText = scrollData.text
        val letterDuration = (1000 / scrollData.speed * 20).toLong() // Adjust timing for letter-by-letter
        
        // Position text in center for vertical letter-by-letter
        textView.gravity = Gravity.CENTER
        
        var currentIndex = 0
        
        val letterAnimator = ValueAnimator.ofInt(0, fullText.length).apply {
            duration = letterDuration * fullText.length
            
            addUpdateListener { animation ->
                val index = animation.animatedValue as Int
                
                val visibleText = when (scrollData.direction) {
                    "top-to-bottom" -> fullText.substring(0, index)
                    "bottom-to-top" -> fullText.substring(fullText.length - index)
                    else -> fullText.substring(0, index)
                }
                
                textView.text = visibleText
            }
            
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.RESTART
        }
        
        animator = letterAnimator
        letterAnimator.start()
        
        Log.d(TAG, "Started letter-by-letter animation for: ${scrollData.text}")
    }

    private fun startTraditionalScrolling(scrollData: ScrollTextData) {
        post {
            val containerWidth = width
            val containerHeight = height
            val textWidth = textView.width
            val textHeight = textView.height
            
            if (containerWidth == 0 || containerHeight == 0) {
                // Layout not ready, try again
                postDelayed({ startTraditionalScrolling(scrollData) }, 100)
                return@post
            }
            
            val (startX, startY, endX, endY, distance) = when (scrollData.direction) {
                "left-to-right" -> {
                    val y = (containerHeight - textHeight) / 2f
                    Tuple5(-textWidth.toFloat(), y, containerWidth.toFloat(), y, containerWidth + textWidth)
                }
                "right-to-left" -> {
                    val y = (containerHeight - textHeight) / 2f
                    Tuple5(containerWidth.toFloat(), y, -textWidth.toFloat(), y, containerWidth + textWidth)
                }
                else -> {
                    val y = (containerHeight - textHeight) / 2f
                    Tuple5(-textWidth.toFloat(), y, containerWidth.toFloat(), y, containerWidth + textWidth)
                }
            }
            
            val duration = (distance / scrollData.speed * 1000).toLong()
            
            val scrollAnimator = ValueAnimator.ofFloat(0f, 1f).apply {
                this.duration = duration
                
                addUpdateListener { animation ->
                    val progress = animation.animatedValue as Float
                    val currentX = startX + (endX - startX) * progress
                    val currentY = startY + (endY - startY) * progress
                    
                    textView.x = currentX
                    textView.y = currentY
                }
                
                repeatCount = ValueAnimator.INFINITE
                repeatMode = ValueAnimator.RESTART
            }
            
            // Set initial position
            textView.x = startX
            textView.y = startY
            
            animator = scrollAnimator
            scrollAnimator.start()
            
            Log.d(TAG, "Started traditional scrolling for: ${scrollData.text}")
        }
    }

    fun stopScrolling() {
        isPlaying = false
        animator?.cancel()
        animator = null
    }

    fun pauseScrolling() {
        animator?.pause()
    }

    fun resumeScrolling() {
        animator?.resume()
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        stopScrolling()
    }

    // Helper data class for multiple return values
    private data class Tuple5<T>(val first: T, val second: T, val third: T, val fourth: T, val fifth: Int)
}