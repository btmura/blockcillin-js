#ifndef BLOCKCILLIN_GL_UTIL_H_
#define BLOCKCILLIN_GL_UTIL_H_

#include "log.h"

class GLUtil {
 public:
  static GLuint CreateShader(const GLenum type, const std::string &path);

 private:
  static const Log log;
};

#endif // BLOCKCILLIN_GL_UTIL_H_
