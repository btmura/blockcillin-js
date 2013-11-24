#ifndef BLOCKCILLIN_LOG_H_
#define BLOCKCILLIN_LOG_H_

#include <string>
#include "GL/glew.h"

class Log {
 public:
  static void Info(const std::string &tag, const char* format, ...);
  static void Error(const std::string &message);
  static void ErrorSDL(const std::string &tag);
  static void ErrorGLEW(const std::string &tag, const GLenum error);
  static void ErrorGL(const std::string &tag, const GLuint error);
};

#endif // BLOCKCILLIN_LOG_H_
